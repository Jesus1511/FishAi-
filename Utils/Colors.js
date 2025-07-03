import { useColorScheme } from "react-native"

function useColors () {

    const isDark = useColorScheme() == "dark"

    const mainGreen = "#B6F075"

    const yellow = "#E2EB0C"

    const errorRed = isDark ? "hsla(0, 100%, 62%, 0.702)" : "hsla(0, 100%, 50%, 0.42)"

    const placeholder = isDark ? "#c6c6c6c8" : "#a3a3a3ff"

    const text = isDark ? "white" : "black"

    const antiText = !isDark ? "white" : "black"

    const ligthText = isDark ? "#ffffffe1" : "#5c5c5c"

    const label = isDark ? "#dddddd" : "#0000007e"

    const background = isDark ? "#282828" : "#ffffff"

    const background2 = isDark ? "#1b1b1b" : "#f0f0f0"

    const input = isDark ? "#363636" : "#ffffff"

    const ligthBackground = isDark ? "#2a2b2a" : "#ffffff"

    const userMessage = isDark ? "#3A5F2C" : "#DCF8C6";
    const botMessage = isDark ? "#363636" : "#E5E5EA";
    const inputBorder = isDark ? "#444" : "#ccc";
    const sendButton = isDark ? "#4F8EF7" : "#2196F3";
    const sendButtonText = "#fff";

    return {
        mainGreen,
        yellow,
        background2,
        ligthBackground,
        placeholder,
        errorRed,
        antiText,
        text,
        ligthText,
        label,
        background,
        input,
        userMessage,
        botMessage,
        inputBorder,
        sendButton,
        sendButtonText
      }
    }

export default useColors