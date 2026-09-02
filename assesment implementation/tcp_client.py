import argparse
import socket
import time

def main():
    parser = argparse.ArgumentParser(description="TCP performance client")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=5001)
    parser.add_argument("--packets", type=int, default=1000)
    parser.add_argument("--payload", type=int, default=1024)
    args = parser.parse_args()

    payload = b"X" * args.payload

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect((args.host, args.port))

    start = time.perf_counter()
    for _ in range(args.packets):
        sock.sendall(payload)

    sock.shutdown(socket.SHUT_WR)
    sock.close()

    elapsed = time.perf_counter() - start
    total = args.packets * args.payload
    throughput = total * 8 / elapsed / 1_000_000

    print(f"Sent {total:,} bytes")
    print(f"Elapsed time: {elapsed:.4f}s")
    print(f"TCP throughput: {throughput:.3f} Mbps")

if __name__ == "__main__":
    main()
