import argparse
import socket
import time

def main():
    parser = argparse.ArgumentParser(description="UDP performance client")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=5002)
    parser.add_argument("--packets", type=int, default=1000)
    parser.add_argument("--payload", type=int, default=1024)
    parser.add_argument("--interval", type=float, default=0.0)
    args = parser.parse_args()

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    payload = b"U" * args.payload

    start = time.perf_counter()
    for sequence in range(args.packets):
        message = sequence.to_bytes(4, "big") + payload
        sock.sendto(message, (args.host, args.port))
        if args.interval > 0:
            time.sleep(args.interval)

    elapsed = time.perf_counter() - start
    total = args.packets * len(message)
    throughput = total * 8 / elapsed / 1_000_000

    print(f"Sent {args.packets} UDP datagrams")
    print(f"Elapsed time: {elapsed:.4f}s")
    print(f"UDP offered throughput: {throughput:.3f} Mbps")
    sock.close()

if __name__ == "__main__":
    main()
