ip=$1
mac=$2

################NAT##########################
if [[ $ip == "10.21"* ]]; then
echo "nat"
ipset del blacklist_nat $ip,$mac >&- 2>&-
ipset add whitelist_nat $ip,$mac >&- 2>&-
fi

if [[ $ip == "10.22"* ]]; then
echo "nat2"
ipset del blacklist_nat2 $ip,$mac >&- 2>&-
ipset add whitelist_nat2 $ip,$mac >&- 2>&-
fi


################NAT##########################
if [[ $ip == "5.83"* ]]; then
echo "pub"
ipset del blacklist_pub $ip,$mac >&- 2>&-
ipset add whitelist_pub $ip,$mac >&- 2>&-
fi

exit 0
