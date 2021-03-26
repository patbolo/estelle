# Mobile tethering

On the phone, go to Settings/Connections/Mobile hotspot and tethering and turn Mobile Hotspot On

# VPN

Set up based on https://www.comparitech.com/blog/vpn-privacy/how-to-make-your-own-free-vpn-using-amazon-web-services/

## To start the VPN on the EC2 instance:
In /home/jean/code/estelle/connect.sh, edit the url used to connect to the EC2 instance
Then run connect.sh
Then `sudo service openvpn start`

## To connect to the VPN from the laptop

In /home/jean/code/estelle/openvpn.ovpn
```
client
dev tun
proto udp
remote 3.104.76.237 1194
ca /home/jean/code/estelle/keys/ca.crt
cert /home/jean/code/estelle/keys/client.crt
key /home/jean/code/estelle/keys/client.key
tls-version-min 1.2
tls-cipher TLS-ECDHE-RSA-WITH-AES-128-GCM-SHA256:TLS-ECDHE-ECDSA-WITH-AES-128-GCM-SHA256:TLS-ECDHE-RSA-WITH-AES-256-GCM-SHA384:TLS-DHE-RSA-WITH-AES-256-CBC-SHA256
cipher AES-256-CBC
auth SHA512
resolv-retry infinite
auth-retry none
nobind
persist-key
persist-tun
ns-cert-type server
comp-lzo
verb 3
tls-client
tls-auth /home/jean/code/estelle/keys/pfs.key
```

`remote` must match the public IP address of the EC2 instance on AWS
Then start openvpn
jean@jean:/home/jean/code/estelle$ sudo openvpn --config openvpn.ovpn

## To connect to the laptop from the EC2 instance
Take note of the `inet addr` when running `ifconfig` on the laptop for `tun0`
Then ssh jean@10.8.0.6 (replace 10.8.0.6 with the inet addr)


## To connect to the EC2 instance through the VPN
Take note of the `Private IPs` address of the EC@ instance in AWS console, ie 172.31.4.170
ssh -i /home/jean/code/estelle/jean.pem ec2-user@172.31.4.170



# The python server

## Prereq:
`serial` module must be install: `pip3 install pyserial`
The port 8889 must be open: 
sudo ufw allow 8889
Take note of the `inet addr` in ifconfig for `tun0`
Then use it in server.py, for the server address, ie server_address = ('10.8.0.6', 8889)

## Server

Then `sudo python3 server.py`

NB: the telescope will only got to position after a star alignment




# point
Point includes a single Python class `NexStar` that wraps the serial commands supported by the Celestron NexStar telescope hand controllers. All of the commands documented in [this document](http://www.nexstarsite.com/download/manuals/NexStarCommunicationProtocolV1.2.zip) are supported. See the comments in the source code for information on each function. This project has been tested by the author with a Celestron NexStar 130 SLT.
