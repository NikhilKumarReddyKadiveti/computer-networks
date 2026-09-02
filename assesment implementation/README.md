# Assignment 6 Q1 — Small Enterprise Network

**Course:** CSA0703 – Computer Networks  
**Assignment:** 6 Q1  
**Topic:** Multi-LAN enterprise network, OSI layers, IPv4 subnetting, routing, TCP/UDP, HTTP, DNS and traffic-performance comparison.

## 1. Project Overview

This repository contains the implementation material for the assignment. The network is designed as four interconnected LANs using a central Cisco router.

### LAN addressing

| LAN | Network | Gateway |
|---|---|---|
| LAN 1 | 10.10.1.0/24 | 10.10.1.1 |
| LAN 2 | 10.10.2.0/24 | 10.10.2.1 |
| LAN 3 | 10.10.3.0/24 | 10.10.3.1 |
| LAN 4 | 10.10.4.0/24 | 10.10.4.1 |

Suggested service hosts:
- DNS Server: `10.10.4.10`
- HTTP Server: `10.10.4.20`

## 2. Repository Structure

```text
packet_tracer/
    enterprise_router_R1.txt
    switch_access_config.txt
    ip_addressing_plan.md
    packet_tracer_build_guide.md

python/
    tcp_server.py
    tcp_client.py
    udp_server.py
    udp_client.py
    performance_test.py
    dns_http_demo.py

data/
    tcp_udp_comparison.csv

docs/
    network_topology.png
    osi_layers.png
    protocol_flow.png
    traffic_workflow.png
```

## 3. Cisco Packet Tracer Implementation

Create:
- 1 router
- 4 switches
- at least 1 PC per LAN
- 1 DNS server
- 1 HTTP server

Connect each switch to a separate router interface. Configure R1 with `enterprise_router_R1.txt`.

The four networks are directly connected to R1, so additional static routes are not necessary.

## 4. Verification

On R1:

```text
show ip interface brief
show ip route
```

From a PC in LAN 1:

```text
ping 10.10.1.1
ping 10.10.4.10
ping 10.10.4.20
```

Use the Packet Tracer Simulation Mode to inspect:
- ARP
- ICMP
- TCP
- HTTP
- DNS

## 5. Python TCP/UDP Demonstration

The Python files provide a reproducible application-level demonstration of TCP and UDP.

### TCP

Terminal 1:
```bash
python python/tcp_server.py
```

Terminal 2:
```bash
python python/tcp_client.py --host 127.0.0.1 --port 5001 --packets 1000
```

### UDP

Terminal 1:
```bash
python python/udp_server.py
```

Terminal 2:
```bash
python python/udp_client.py --host 127.0.0.1 --port 5002 --packets 1000
```

### Performance comparison

```bash
python python/performance_test.py
```

The script generates `data/tcp_udp_comparison.csv`.

## 6. Important Academic Note

The Python results are a reproducible software demonstration, not a replacement for Cisco Packet Tracer measurements. For the final submission, if your faculty specifically requires Packet Tracer observations, record the actual Simulation Mode results and replace the example CSV values with your measured data.

## 7. Technologies

- Cisco Packet Tracer
- Cisco IOS CLI
- IPv4 / subnetting
- TCP/IP
- UDP
- HTTP
- DNS
- Python sockets
- Git / GitHub
