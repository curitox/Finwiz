import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import styled, { useTheme } from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import Button from "../components/buttons/button";
import { CameraView, useCameraPermissions } from "expo-camera";

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
  margin-top: 18px;
  color: ${({ theme }) => theme.text_primary};
`;

const QRScanner = () => {
  const router = useRouter();
  const theme = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = ({ type, data }) => {
    console.log("scanned");
    setScanned(true);
    const chechUrl = data.split(":")[0] === "upi";
    if (chechUrl) {
      router.replace({ pathname: `/add-transactions`, params: { data } });
    } else {
      alert(`Please scan a payment UPI QR Code`);
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <Container>
        <Back onPress={() => router.replace("/home")}>
          <Ionicons name="chevron-back" size={22} color={theme.text_primary} />
        </Back>
        <Container>
          <Title>We need your permission to show the camera</Title>
          <Container>
            <Button
              onPress={requestPermission}
              filled
              color={theme.white}
              bgcolor={theme.primary}
            >
              Grant Cammera Permissions
            </Button>
          </Container>
        </Container>
      </Container>
    );
  }

  return (
    <Container>
      <Back onPress={() => router.replace("/home")}>
        <Ionicons name="chevron-back" size={22} color={theme.text_primary} />
      </Back>
      <Title>Scan Your Payment QR code</Title>
      <View style={styles.cameraContainer}>
        <CameraView
          facing={facing}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          style={styles.fixedRatio}
          ratio={"1:1"}
        ></CameraView>
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
