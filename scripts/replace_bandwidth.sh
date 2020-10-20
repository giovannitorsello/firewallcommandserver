ip=$1
mac=$2

download_min=`echo "1.1*$3" | bc`
download_max=`echo "1.1*$4" | bc`
upload_min=`echo "1.1*$5" | bc`
upload_max=`echo "1.1*$6" | bc`
burst="1000Kbit"
cburst="500Kbit"


echo $ip $mac
echo $download_min $download_max $upload_min $upload_max

#convert ip in hex
ip_temp=`echo ${ip//./ }`
ip_hex=`printf '%02x' $ip_temp`

IFACE_PUB="em1"
IFACE_PUB_VIRT="ifb0"

IFACE_NAT="em2"
IFACE_NAT_VIRT="ifb1"


################NAT##########################
if [[ $ip =~ "10.21"* ]]; then
echo "Inizio configurazione profilo di banda (NAT)"
filter_rule=`tc filter show dev $IFACE_NAT | grep $ip_hex -B1`

#Find flow_id number
fields_filter_rule=(${filter_rule// / })
flow_id=${fields_filter_rule[18]}

#Controlla se la regola di banda è già inserita
if [ ! -z "$flow_id" -a "$flow_id" != " " ]; then
#Regola nota sostituzione
	echo "Sostituzione regola di bandwith NAT"
	class_rule=`tc class show dev $IFACE_NAT | grep $flow_id`	
	#download
	tc class change dev $IFACE_NAT parent 1:4 classid $flow_id htb rate ${download_max}Kbit  ceil ${download_max}Kbit burst ${burst} cburst ${cburst}
	#upload
	tc class  change dev $IFACE_NAT_VIRT parent 1:4 classid $flow_id htb rate ${upload_max}Kbit  ceil ${upload_max}Kbit burst ${burst} cburst ${cburst}
	echo "operazione terminata con successo (Replacement NAT rule)"
else
	echo "Inserimento nuova regola QOS (NAT)"
	last_filter_rule=`tc filter show dev $IFACE_NAT | tail -n2`
	echo "Last flow id is $last_filter_rule"
	fields_filter_rule=(${last_filter_rule// / })
	flow_id=${fields_filter_rule[18]}
	echo "Last flow id is $flow_id"	
	fields_flow_id=(${flow_id//:/ })
	id=${fields_flow_id[1]}
	((id+=1)) #increment flow_id
	flow_id="1:$id";
	echo "Using $flow_id"
	#download
        tc class add dev $IFACE_NAT parent 1:4 classid $flow_id htb rate ${download_max}Kbit  ceil ${download_max}Kbit burst ${burst} cburst	${cburst}
	tc filter add dev $IFACE_NAT parent 1:0 protocol ip prio 1 u32 match ip dst $ip flowid $flow_id

        #upload
        tc class add dev $IFACE_NAT_VIRT parent 1:4 classid $flow_id htb rate ${upload_max}Kbit  ceil ${upload_max}Kbit burst ${burst} cburst	${cburst}
	tc filter add dev $IFACE_NAT_VIRT parent 1:0 protocol ip prio 1 u32 match ip src $ip flowid $flow_id
        echo "operazione terminata con successo (Insert new NAT rule $id)"
fi
fi #Fine se NAT


#################PUBLIC###################
if [[ $ip =~ "5.83"* ]]; then
echo "Inizio configurazione profilo di banda (PUB)"
#find rule
filter_rule=`tc filter show dev $IFACE_PUB | grep $ip_hex -B1`

#Find flow_id number
fields_filter_rule=(${filter_rule// / })
flow_id=${fields_filter_rule[18]}


#Controlla se la regola	di banda è già inserita
if [ ! -z "$flow_id" -a "$flow_id" != " " ]; then
#Regola	nota sostituzione
	class_rule=`tc class show dev $IFACE_PUB | grep $flow_id`
	#download
	tc class change dev $IFACE_PUB parent 1:4 classid $flow_id htb rate ${download_max}Kbit ceil ${download_max}Kbit  burst ${burst} cburst	${cburst}
	#upload
	tc class change dev $IFACE_PUB_VIRT parent 1:4 classid $flow_id htb rate ${upload_max}Kbit   ceil ${upload_max}Kbit    burst ${burst} cburst	${cburst}
	echo "Operazione terminata con successo (Replacement PUB rule)"
else
    	echo "Inserimento nuova regola QOS (PUB)"
        last_filter_rule=`tc filter show dev $IFACE_PUB | tail -n2`
        fields_filter_rule=(${last_filter_rule// / })
        flow_id=${fields_filter_rule[18]}
        fields_flow_id=(${flow_id//:/ })
        id=${fields_flow_id[1]}
        ((id+=1)) #increment flow_id
        flow_id="1:$id";
	echo "Using $flow_id"
        #download
        tc class add dev $IFACE_PUB parent 1:4 classid $flow_id htb rate ${download_max}Kbit  ceil ${download_max}Kbit burst ${burst} cburst	${cburst}
        tc filter add dev $IFACE_PUB parent 1:0 protocol ip prio 1 u32 match ip dst $ip flowid $flow_id
        #upload
        tc class add dev $IFACE_PUB_VIRT parent 1:4 classid $flow_id htb rate ${upload_max}Kbit  ceil ${upload_max}Kbit burst ${burst} cburst	${cburst}
        tc filter add dev $IFACE_PUB_VIRT parent 1:0 protocol ip prio 1 u32 match ip src $ip flowid $flow_id
        echo "operazione terminata con successo (Insert new PUB rule $id)"

fi

fi #End se PUB
