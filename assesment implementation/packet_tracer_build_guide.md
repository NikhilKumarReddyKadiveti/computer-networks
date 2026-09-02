# Cisco Packet Tracer Step-by-Step Build

## Devices

- Router: 1
- Switches: 4
- PCs: minimum 4
- DNS server: 1
- HTTP server: 1

## Cabling

```text
PCs -> Switches -> R1
```

Use one router interface per LAN:

```text
R1 G0/0 -> SW1 -> LAN 1
R1 G0/1 -> SW2 -> LAN 2
R1 G0/2 -> SW3 -> LAN 3
R1 G0/3 -> SW4 -> LAN 4
```

## Router

Paste `enterprise_router_R1.txt` into R1 CLI.

## PC Configuration

Example LAN 1 PC:

```text
IP Address:      10.10.1.10
Subnet Mask:     255.255.255.0
Default Gateway: 10.10.1.1
DNS Server:      10.10.4.10
```

Repeat using the appropriate LAN subnet.

## DNS Server

Set:

```text
IP:      10.10.4.10
Mask:    255.255.255.0
Gateway: 10.10.4.1
```

Services -> DNS -> ON

Add an A record:

```text
Name:    www.enterprise.local
Address: 10.10.4.20
```

## HTTP Server

Set:

```text
IP:      10.10.4.20
Mask:    255.255.255.0
Gateway: 10.10.4.1
```

Services -> HTTP -> ON

Edit the HTTP page to show the enterprise network project title.

## Verification

From every PC:

```text
ping <local gateway>
ping 10.10.4.10
ping 10.10.4.20
```

Then open the PC Web Browser:

```text
http://10.10.4.20
```

If DNS is configured correctly, also test:

```text
http://www.enterprise.local
```

## Simulation Mode

Inspect:
1. ARP
2. ICMP
3. TCP
4. HTTP
5. DNS

Record packet count, delay and delivery observations.

## Traffic Conditions

### Low
One client sends HTTP/DNS traffic.

### Medium
Multiple clients generate simultaneous TCP/HTTP and UDP traffic.

### High
Several clients generate repeated concurrent flows.

For each scenario record:

- packets sent
- packets received
- packet loss
- average delay
- throughput
- TCP retransmissions where visible
