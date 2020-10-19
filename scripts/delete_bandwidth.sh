ip=$1
mac=$2
download_min=$3
download_max=$4
upload_min=$5
upload_max=$6

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

#Find flow_id and handle number on class
filter_rule=`tc filter show dev $IFACE_NAT | grep $ip_hex -B1`
fields_filter_rule=(${filter_rule// / })
flow_id=${fields_filter_rule[18]}
handle_id=${fields_filter_rule[9]}
echo "Deleting class $flow_id - Filter $handle_id"

#Controlla se la regola di banda è già inserita
if [ ! -z "$flow_id" -a "$flow_id" != " " ]; then
#Regola nota cancellazione
	class_rule=`tc class show dev $IFACE_NAT | grep $flow_id`	
	#download
	tc filter del dev $IFACE_NAT parent 1: proto ip prio 1 handle $handle_id u32
	tc class delete dev $IFACE_NAT parent 1:20 classid $flow_id htb rate ${download_min}Kbit  ceil ${download_max}Kbit burst 500kbit
	#upload
	tc filter del dev $IFACE_NAT_VIRT parent 1: proto ip prio 1 handle $handle_id u32
	tc class delete dev $IFACE_NAT_VIRT parent 1:20 classid $flow_id htb rate ${upload_min}Kbit  ceil ${upload_max}Kbit burst 500kbit
	echo "operazione terminata con successo (Delete NAT rule $flow_id)"
else
	echo "Regola QOS (NAT) non esistente"
fi #Fine se regola nota
fi #Fine se NAT


#################PUBLIC###################
if [[ $ip =~ "5.83"* ]]; then
echo "Inizio configurazione profilo di banda (PUB)"
#Find flow_id and handle_id number
filter_rule=`tc filter show dev $IFACE_PUB | grep $ip_hex -B1`
fields_filter_rule=(${filter_rule// / })
flow_id=${fields_filter_rule[18]}
handle_id=${fields_filter_rule[9]}
echo "Deleting class $flow_id - Filter $handle_id"

#Controlla se la regola	di banda è già inserita
if [ ! -z "$flow_id" -a "$flow_id" != " " ]; then
#Regola	nota cancellazione
	class_rule=`tc class show dev $IFACE_PUB | grep $flow_id`
	#download
	tc filter del dev $IFACE_PUB parent 1: proto ip prio 1 handle $handle_id u32        
	tc class delete dev $IFACE_PUB parent 1:20 classid $flow_id htb rate ${download_min}Kbit ceil ${download_max}Kbit  burst 500kbit
	#upload
	tc filter del dev $IFACE_PUB_VIRT parent 1: proto ip prio 1 handle $handle_id u32        
	tc class delete dev $IFACE_PUB_VIRT parent 1:20 classid $flow_id htb rate ${upload_min}Kbit   ceil ${upload_max}Kbit    burst 500kbit
	echo "Operazione terminata con successo (Delete PUB rule $flow_id)"
else
    	echo "Regola QOS (PUB) non esistente"
fi #Fine se regola nota
fi #End se PUB
