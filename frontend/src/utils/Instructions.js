// utils/Instruction.js
const sendMessage = (socket, type, role, name, instruction, heartbeatTimer, setPendingState, setIsRebooting) => {
    if (socket) {
        const message = {
            type: type,
            to: "panel",
            name: name,
            from: role,
            role: role,
            instruction: instruction,
            heartbeatTimer: heartbeatTimer
        };
        socket.send(JSON.stringify(message));
        setPendingState(type);

        if (type === 'reboot') {
            setIsRebooting(true);
        }
    }
};

export default sendMessage;

