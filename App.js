import React, { useEffect } from "react";
import { StatusBar, View, Text } from "react-native";
import mqtt from "mqtt/dist/mqtt"; // TODO: try azure iot mqtt !!

const App = () => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Initialize Azure IoT Hub MQTT connection
                const deviceConnectionString =
                    "YOUR_CONNECTION_STRING";
                const deviceId = deviceConnectionString.match(/DeviceId=(.*?);/)?.[1];
                const mqttEndpoint = deviceConnectionString.match(/HostName=(.*?);/)?.[1];
                const password = deviceConnectionString.match(/SharedAccessKey=(.*?)(?:;|$)/)?.[1];
                const topic = `devices/${deviceId}/messages/events/`;

                const client = mqtt.connect(`mqtts://${mqttEndpoint}`, {
                    clientId: deviceId,
                    username: `${mqttEndpoint}/${deviceId}/api-version=2018-06-30`,
                    password,
                });

                // Define sample data
                const data = {
                    temperature: 25.5,
                    humidity: 60.0,
                };

                // Convert data to JSON string
                const payload = JSON.stringify(data);

                // Send data to Azure IoT Hub using MQTT
                const handleConnect = () => {
                    client.publish(topic, payload, { qos: 1 }, (err) => {
                        if (err) {
                            console.error("Error publishing message to Azure IoT Hub: " + err.toString());
                        } else {
                            console.log("Message published to Azure IoT Hub");
                        }

                        // Close the connection when the message is sent
                        client.end();
                    });
                };

                client.on("connect", handleConnect);

                // Handle errors during connection setup
                client.on("error", (err) => {
                    console.error("MQTT error during connection setup: " + err.toString());
                });

                // Cleanup logic
                return () => {
                    client.off("connect", handleConnect); // Remove the connect listener
                    client.end();
                };
            } catch (error) {
                console.error("Error in fetchData: " + error.toString());
            }
        };

        fetchData();
    }, []); // Ensure an empty dependency array to run the effect only once

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Text>Data Sent to Azure IoT Hub using MQTT</Text>
            <StatusBar style="auto" />
        </View>
    );
};

export default App;