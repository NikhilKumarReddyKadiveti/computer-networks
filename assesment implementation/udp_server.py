import argparse
import socket
import time

def main():
    parser = argparse.ArgumentParser(description="UDP performance server")
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=5002)
    parser.add_argument("--packets", type=int, default=1000)
    parser.add_argument("--timeout", type=float, default=5.0)
    args = parser.parse_args()

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind((args.host, args.port))
    sock.settimeout(args.timeout)

    print(f"UDP server listening on {args.host}:{args.port}")
    received = 0
    bytes_received = 0
    start = time.perf_counter()

    while received < args.packets:
        try:
            data, addr = sock.recvfrom(65535)
        except socket.timeout:
            break
        received += 1
        bytes_received += len(data)

    elapsed = time.perf_counter() - start
    throughput = bytes_received * 8 / elapsed / 1_000_000 if elapsed else 0
    delivery = received / args.packets * 100

    print(f"Packets received: {received}/{args.packets}")
    print(f"Delivery: {delivery:.2f}%")
    print(f"Received {bytes_received:,} bytes in {elapsed:.4f}s")
    print(f"Measured UDP throughput: {throughput:.3f} Mbps")

if __name__ == "__main__":
    main()
