import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import db from "../../firebase/config";

const CreateScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [photo, setPhoto] = useState(null);
  const [camera, setCamera] = useState(null);
  const [location, setLocation] = useState(null);
  const [comment, setComment] = useState("");
  const { userId, nickname } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const takePhoto = async () => {
    const { uri } = await camera.takePictureAsync();
    setPhoto(uri);
  };

  const sendPhoto = () => {
    uploadPhotoToServer();
    uploadPostToServer();
    navigation.navigate("DefaultScreen");
  };

  const uploadPostToServer = async () => {
    await db
      .firestore()
      .collection("posts")
      .add({ photo, comment, location: location.coords, userId, nickname });
  };

  const uploadPhotoToServer = async () => {
    const response = await fetch(photo);
    const file = await response.blob();
    const uniquePostId = Date.now().toString();
    await db.storage().ref(`postImage/${uniquePostId}`).put(file);

    const processesPhoto = await db
      .storage("postImage")
      .child(uniquePostId)
      .getDownloadURL();

    return processesPhoto;
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null}>
        <Camera style={styles.camera} ref={setCamera}>
          {photo && (
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: photo }}
                style={{ width: 200, height: 200, borderRadius: 10 }}
              />
            </View>
          )}
          <TouchableOpacity style={styles.titleCont} onPress={takePhoto}>
            <Text style={styles.camTitle}>+</Text>
          </TouchableOpacity>
        </Camera>

        <View>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} onChangeText={setComment} />
          </View>
          <TouchableOpacity style={styles.sendBtn} onPress={sendPhoto}>
            <Text style={styles.btnTitle}>Send photo</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  camera: {
    height: "70%",
    marginTop: 30,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  titleCont: {
    marginBottom: 20,
    width: 70,
    height: 70,
    borderWidth: 1,
    borderColor: "#f0f8ff",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  camTitle: {
    color: "#f0f8ff",
  },

  photoContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    borderColor: "#f0f8ff",
    borderWidth: 1,
    borderRadius: 10,
  },

  sendBtn: {
    marginHorizontal: 10,
    height: 40,
    borderWidth: 2,
    borderColor: "#F00",
    borderRadius: 10,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  btnTitle: {
    fontSize: 18,
    color: "#f00",
  },

  inputContainer: {
    marginHorizontal: 10,
  },

  input: {
    height: 40,
    borderWidth: 2,
    borderColor: "#fff",
    borderBottomColor: "#f00",
  },
});

export default CreateScreen;
