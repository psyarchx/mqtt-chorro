
while true; do
    mosquitto_pub -t chorro -h test.mosquitto.org -m "nx12.5y0.8"
    sleep 0.5
    mosquitto_pub -t chorro -h test.mosquitto.org -m "nx22.5y0.8"
    sleep 0.5
    mosquitto_pub -t chorro -h test.mosquitto.org -m "nx32.5y0.8"
    sleep 0.5
    mosquitto_pub -t chorro -h test.mosquitto.org -m "nx42.5y0.8"
    sleep 0.5
    mosquitto_pub -t chorro -h test.mosquitto.org -m "nx32.5y0.8"
    sleep 0.5
    mosquitto_pub -t chorro -h test.mosquitto.org -m "nx22.5y0.8"
    sleep 0.5
    mosquitto_pub -t chorro -h test.mosquitto.org -m "nx12.5y0.8"
    sleep 0.5
    mosquitto_pub -t chorro -h test.mosquitto.org -m "nx02.5y0.8"
    sleep 0.5

    mosquitto_pub -t chorro -h test.mosquitto.org -m "nx02.5y10.8"
    sleep 0.5
    mosquitto_pub -t chorro -h test.mosquitto.org -m "nx02.5y20.8"
    sleep 0.5
    mosquitto_pub -t chorro -h test.mosquitto.org -m "nx02.5y30.8"
    sleep 0.5
    mosquitto_pub -t chorro -h test.mosquitto.org -m "nx02.5y40.8"
    sleep 0.5
    mosquitto_pub -t chorro -h test.mosquitto.org -m "nx12.5y30.8"
    sleep 0.5

    mosquitto_pub -t chorro -h test.mosquitto.org -m "nx22.5y30.8"
    sleep 0.5
    mosquitto_pub -t chorro -h test.mosquitto.org -m "nx32.5y30.8"
    sleep 0.5


done
