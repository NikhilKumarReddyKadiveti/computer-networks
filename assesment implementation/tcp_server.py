import argparse
import socket
import time

def main():
    parser = argparse.ArgumentParser(description="TCP performance server")
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=5001)
    args = parser.parse_args()

    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind((args.host, args.port))
    server.listen(5)

    print(f"TCP server listening on {args.host}:{args.port}")

    while True:
        conn, addr = server.accept()
        print("Connected:", addr)
        total = 0
        start = time.perf_counter()

        with conn:
            while True:
                data = conn.recv(65536)
                if not data:
                    break
                total += len(data)

        elapsed = time.perf_counter() - start
        mbps = (total * 8 / elapsed / 1_000_000) if elapsed else 0
        print(f"Received {total:,} bytes in {elapsed:.4f}s")
        print(f"Measured TCP throughput: {mbps:.3f} Mbps")

if __name__ == "__main__":
    main()
