ip=$1
mac=$2

################NAT##########################
if [[ $ip == "10.21"* ]]; then
echo "nat"
ipset del whitelist_nat $ip,$mac >&- 2>&-
ipset del blacklist_nat $ip,$mac >&- 2>&-
ipset add blacklist_nat $ip,$mac
fi


if [[ $ip == "10.22"* ]]; then
echo "nat"
ipset del whitelist_nat2 $ip,$mac >&- 2>&-
ipset del blacklist_nat2 $ip,$mac >&- 2>&-
ipset add blacklist_nat2 $ip,$mac
fi


################NAT##########################
if [[ $ip == "5.83"* ]]; then
echo "pub"
ipset del whitelist_pub $ip,$mac >&- 2>&-
ipset del blacklist_pub $ip,$mac >&- 2>&-
ipset add blacklist_pub $ip,$mac
fi

exit 0
