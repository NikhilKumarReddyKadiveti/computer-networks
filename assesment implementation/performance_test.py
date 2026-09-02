import csv
import math

# This is a deterministic comparison model for report reproducibility.
# It does NOT claim to be a Cisco Packet Tracer measurement.

SCENARIOS = [
    ("Low", 0.01),
    ("Medium", 0.05),
    ("High", 0.15),
]

CAPACITY = 10.0

def tcp(loss):
    # TCP reduces effective throughput as loss causes congestion control.
    throughput = CAPACITY * (1 - 2 * loss)
    delivery = 100 * (1 - loss * 0.25)
    delay = 8 + 55 * loss
    return max(0, throughput), delivery, delay

def udp(loss):
    # UDP does not retransmit; delivery follows the loss level.
    throughput = CAPACITY * (1 - 0.7 * loss)
    delivery = 100 * (1 - loss)
    delay = 5 + 25 * loss
    return throughput, delivery, delay

rows = []

for traffic, loss in SCENARIOS:
    for protocol, model in [("TCP", tcp), ("UDP", udp)]:
        throughput, delivery, delay = model(loss)
        rows.append({
            "Traffic": traffic,
            "Protocol": protocol,
            "Packet_Loss_%": round(loss * 100, 2),
            "Packet_Delivery_%": round(delivery, 2),
            "Delay_ms": round(delay, 2),
            "Throughput_Mbps": round(throughput, 2),
        })

with open("data/tcp_udp_comparison.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print("Generated data/tcp_udp_comparison.csv")
for row in rows:
    print(row)
