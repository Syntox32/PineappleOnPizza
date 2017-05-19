package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net"
	"net/http"
	"strings"
	"time"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

var DB *gorm.DB

type JSONReturn struct {
	Total     int
	Upvotes   int
	Downvotes int
}

type GlobalStats struct {
	ID           int `gorm:"AUTO_INCREMENT"`
	Total        int
	Upvotes      int
	Downvotes    int
	UniqueVoters int
	LastVote     time.Time
	FirstVote    time.Time
}

type Voter struct {
	ID        int `gorm:"AUTO_INCREMENT"`
	IP        string
	Upvotes   int
	Downvotes int
	LastVote  time.Time
	FirstVote time.Time
}

//ipRange - a structure that holds the start and end of a range of ip addresses
type ipRange struct {
	start net.IP
	end   net.IP
}

// inRange - check to see if a given ip address is within a range given
func inRange(r ipRange, ipAddress net.IP) bool {
	// strcmp type byte comparison
	if bytes.Compare(ipAddress, r.start) >= 0 && bytes.Compare(ipAddress, r.end) < 0 {
		return true
	}
	return false
}

var privateRanges = []ipRange{
	ipRange{
		start: net.ParseIP("10.0.0.0"),
		end:   net.ParseIP("10.255.255.255"),
	},
	ipRange{
		start: net.ParseIP("100.64.0.0"),
		end:   net.ParseIP("100.127.255.255"),
	},
	ipRange{
		start: net.ParseIP("172.16.0.0"),
		end:   net.ParseIP("172.31.255.255"),
	},
	ipRange{
		start: net.ParseIP("192.0.0.0"),
		end:   net.ParseIP("192.0.0.255"),
	},
	ipRange{
		start: net.ParseIP("192.168.0.0"),
		end:   net.ParseIP("192.168.255.255"),
	},
	ipRange{
		start: net.ParseIP("198.18.0.0"),
		end:   net.ParseIP("198.19.255.255"),
	},
}

// isPrivateSubnet - check to see if this ip is in a private subnet
func isPrivateSubnet(ipAddress net.IP) bool {
	// my use case is only concerned with ipv4 atm
	if ipCheck := ipAddress.To4(); ipCheck != nil {
		// iterate over all our ranges
		for _, r := range privateRanges {
			// check if this ip is in a private range
			if inRange(r, ipAddress) {
				return true
			}
		}
	}
	return false
}

// https://husobee.github.io/golang/ip-address/2015/12/17/remote-ip-go.html
func getIPAdress(r *http.Request) string {
	for _, h := range []string{"X-Forwarded-For", "X-Real-Ip"} {
		addresses := strings.Split(r.Header.Get(h), ",")
		// march from right to left until we get a public address
		// that will be the address right before our proxy.
		for i := len(addresses) - 1; i >= 0; i-- {
			ip := strings.TrimSpace(addresses[i])
			// header can contain spaces too, strip those out.
			realIP := net.ParseIP(ip)
			if !realIP.IsGlobalUnicast() || isPrivateSubnet(realIP) {
				// bad address, go to next
				continue
			}
			return ip
		}
	}
	return ""
}

func main() {
	DB, err := gorm.Open("sqlite3", "counter.db")
	if err != nil {
		panic("failed to connect database")
	}
	defer DB.Close()

	DB.AutoMigrate(&GlobalStats{})
	DB.AutoMigrate(&Voter{})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "index.html")
	})

	http.HandleFunc("/upvote", func(w http.ResponseWriter, r *http.Request) {
		ip := getIPAdress(r)
		if ip == "" {
			ip = strings.Split(r.RemoteAddr, ":")[0]
		}
		log.Println(ip)

		var stats GlobalStats
		if DB.First(&stats).RecordNotFound() {
			log.Println("Creating gloabl status object")
			DB.Create(&GlobalStats{FirstVote: time.Now()})
		}
		stats.LastVote = time.Now()
		stats.Upvotes++
		stats.Total++
		DB.Save(&stats)

		var vote Voter
		if DB.Where(&Voter{IP: ip}).First(&vote).RecordNotFound() {
			log.Println("Creating record")
			DB.Create(&Voter{IP: ip, FirstVote: time.Now()})
		}
		vote.LastVote = time.Now()
		vote.Upvotes++
		DB.Save(&vote)

		js, err := json.Marshal(&JSONReturn{Total: stats.Total, Upvotes: stats.Upvotes, Downvotes: stats.Downvotes})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(js)
	})

	http.HandleFunc("/downvote", func(w http.ResponseWriter, r *http.Request) {
		ip := getIPAdress(r)
		if ip == "" {
			ip = strings.Split(r.RemoteAddr, ":")[0]
		}
		log.Println(ip)

		var stats GlobalStats
		if DB.First(&stats).RecordNotFound() {
			log.Println("Creating gloabl status object")
			DB.Create(&GlobalStats{FirstVote: time.Now()})
		}
		stats.LastVote = time.Now()
		stats.Downvotes++
		stats.Total++
		DB.Save(&stats)

		var vote Voter
		if DB.Where(&Voter{IP: ip}).First(&vote).RecordNotFound() {
			log.Println("Creating record")
			DB.Create(&Voter{IP: ip, FirstVote: time.Now()})
		}
		vote.LastVote = time.Now()
		vote.Downvotes++
		DB.Save(&vote)

		js, err := json.Marshal(&JSONReturn{Total: stats.Total, Upvotes: stats.Upvotes, Downvotes: stats.Downvotes})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(js)
	})

	http.HandleFunc("/stats", func(w http.ResponseWriter, r *http.Request) {
		var stats GlobalStats
		if DB.First(&stats).RecordNotFound() {
			log.Println("Creating gloabl status object")
			DB.Create(&GlobalStats{FirstVote: time.Now()})
		}

		js, err := json.Marshal(&JSONReturn{Total: stats.Total, Upvotes: stats.Upvotes, Downvotes: stats.Downvotes})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(js)
	})

	log.Println("Listening on port 8080...")
	log.Println(http.ListenAndServe(":8080", nil))
}
