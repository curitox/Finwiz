import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Camera } from "expo-camera";
import styled, { useTheme } from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import {  useRouter } from "expo-router";
import { BarCodeScanner } from "expo-barcode-scanner";
import Button from "../components/buttons/button";

const Container = styled.View`
  flex: 1;
  gap: 2px;
  padding: 52px 12px;
  background-color: ${({ theme }) => theme.bg};
`;

const Back = styled.TouchableOpacity`
  width: 46px;
  height: 46px;
  border-radius: 46px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.text_secondary + 20};
`;

const Title = styled.Text`
  text-align: center;
  font-weight: 600;
  font-size: 24px;
  margin-top: 12px;
  color: ${({ theme }) => theme.text_primary};
`;

const QRScanner = () => {
  const router = useRouter();
  const theme = useTheme();
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    const chechUrl = data.split(":")[0] === "upi";
    if (chechUrl) {
      router.replace({ pathname: `/add-transactions`, params: { data } });
    } else {
      alert(`Please scan a payment UPI QR Code`);
    }
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <Container>
      <Back onPress={() => router.replace("/home")}>
        <Ionicons name="chevron-back" size={22} color={theme.text_primary} />
      </Back>
      <Title>Scan Your Payment QR code</Title>
      <View style={styles.cameraContainer}>
        {hasCameraPermission ? (
          <Camera
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            barCodeScannerSettings={{
              barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
            }}
            style={styles.fixedRatio}
            ratio={"1:1"}
          />
        ) : (
          <></>
        )}
      </View>
      {scanned && (
        <Button
          filled
          color={theme.white}
          bgcolor={theme.primary}
          onPress={() => setScanned(false)}
        >
          Tap To Scan Again
        </Button>
      )}
    </Container>
  );
};
const styles = StyleSheet.create({
  cameraContainer: {
    flex: 0.9,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: "12px",
  },
  fixedRatio: {
    flex: 0.9,
    aspectRatio: 1,
    borderRadius: "12px",
  },
});

export default QRScanner;
