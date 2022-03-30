import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";

import { useDispatch } from "react-redux";
import { authSignInUser } from "../../redux/auth/auth-operations";

const initialState = {
  email: "",
  password: "",
};

export default function LoginScreen({ navigation }) {
  const [isShow, setIsShow] = useState(false);
  const [state, setState] = useState(initialState);

  const dispatch = useDispatch();

  const [dimensions, setDimensions] = useState(
    Dimensions.get("window").width - 20 * 2
  );

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width - 20 * 2;
      setDimensions(width);
    };

    const subscription = Dimensions.addEventListener("change", onChange);

    return () => subscription?.remove();
  }, []);

  const keyboardHide = () => {
    setIsShow(false);
    Keyboard.dismiss();
  };

  const handleSubmit = () => {
    setIsShow(false);
    Keyboard.dismiss();
    dispatch(authSignInUser(state));
    setState(initialState);
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.image}
          source={require("../../assets/images/night.jpg")}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
          >
            <View
              style={{
                ...styles.form,
                marginBottom: isShow ? 20 : 100,
                width: dimensions,
              }}
            >
              <View style={styles.header}>
                <Text style={styles.red}>MY APLICATION</Text>
                <Text style={styles.headerTitle}>LOGIN</Text>
              </View>

              <View>
                <Text style={styles.inputTitle}>Email:</Text>
                <TextInput
                  style={styles.input}
                  textAlign="center"
                  value={state.email}
                  onFocus={() => setIsShow(true)}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, email: value }))
                  }
                />
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={styles.inputTitle}>Password:</Text>
                <TextInput
                  style={styles.input}
                  textAlign="center"
                  value={state.password}
                  onFocus={() => setIsShow(true)}
                  secureTextEntry={true}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, password: value }))
                  }
                />
              </View>
              <TouchableOpacity
                style={styles.btn}
                activeOpacity={0.8}
                onPress={handleSubmit}
              >
                <Text style={styles.btnTitle}>Sign In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.navigate("Register")}
              >
                <Text style={styles.navTitle}>Go to Register</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 120,
  },

  headerTitle: {
    fontFamily: "DMMono-Regular",
    fontSize: 30,
    color: "#f0f8ff",
  },

    input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#f0f8ff",
    borderRadius: 6,
    color: "#f0f8ff",
  },

  inputTitle: {
    marginBottom: 10,
    fontFamily: "DMMono-Regular",
    fontSize: 16,
    color: "#f0f8ff",
  },

  btn: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 6,
    marginTop: 40,
    ...Platform.select({
      ios: {
        backgroundColor: "transparent",
        borderColor: "#f0f8ff",
      },
      android: {
        backgroundColor: "#f00",
        borderColor: "transparent",
      },
    }),
  },

  btnTitle: {
    fontFamily: "DMMono-Regular",
    fontSize: 18,
    color: Platform.OS === "ios" ? "#f00" : "#fff",
  },

  navTitle: {
    marginTop: 20,
    fontSize: 18,
    color: "#1e90ff",
    textAlign: "center",
  },

  red: {
    marginBottom: 20,
    fontFamily: "DMMono-Regular",
    fontSize: 30,
    color: "#f00",
  },
});
