# IPv4 Addressing and Subnetting Plan

## Subnet Design

A `/24` prefix uses mask `255.255.255.0`.

Number of addresses:

`2^(32-24) = 256`

Usable host addresses:

`256 - 2 = 254`

| LAN | Network | First Usable | Last Usable | Broadcast | Gateway |
|---|---|---|---|---|---|
| LAN 1 | 10.10.1.0/24 | 10.10.1.1 | 10.10.1.254 | 10.10.1.255 | 10.10.1.1 |
| LAN 2 | 10.10.2.0/24 | 10.10.2.1 | 10.10.2.254 | 10.10.2.255 | 10.10.2.1 |
| LAN 3 | 10.10.3.0/24 | 10.10.3.1 | 10.10.3.254 | 10.10.3.255 | 10.10.3.1 |
| LAN 4 | 10.10.4.0/24 | 10.10.4.1 | 10.10.4.254 | 10.10.4.255 | 10.10.4.1 |

## Example Hosts

| Device | Address | Mask | Gateway |
|---|---|---|---|
| PC-A | 10.10.1.10 | 255.255.255.0 | 10.10.1.1 |
| PC-B | 10.10.2.10 | 255.255.255.0 | 10.10.2.1 |
| PC-C | 10.10.3.10 | 255.255.255.0 | 10.10.3.1 |
| PC-D | 10.10.4.10 | 255.255.255.0 | 10.10.4.1 |
| HTTP Server | 10.10.4.20 | 255.255.255.0 | 10.10.4.1 |

For DNS, use `10.10.4.10`. If PC-D is also needed as a client, assign it another free address such as `10.10.4.30`.
