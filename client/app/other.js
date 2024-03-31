import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Image, Linking } from "react-native";
import { Camera } from "expo-camera";
import styled from "styled-components";
// import { Camera } from "expo-barcode-scanner";

const Container = styled.View`
  flex: 1;
  gap: 2px;
  padding: 52px 12px;
  background-color: ${({ theme }) => theme.bg};
`;

const Title = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const Other = () => {
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
  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    console.log("Here");
    setScanned(true);
    alert(
      `Bar code with type ${type} and data ${Linking.openURL(
        `${data}`
      )} has been scanned!`
    );
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <Container>
      <Title>Scan Your Payment QR code</Title>
      <View style={styles.cameraContainer}>
        {hasCameraPermission ? (
          <Camera
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.fixedRatio}
            ratio={"1:1"}
          />
        ) : (
          <></>
        )}
      </View>
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
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
  },
  fixedRatio: {
    flex: 0.9,
    aspectRatio: 1,
  },
});

export default Other;
