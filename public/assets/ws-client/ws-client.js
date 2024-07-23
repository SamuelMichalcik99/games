const socket = io('https://www.games.samuelmichalcik.sk', {
    path: '/ws'
});

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', (reason) => {
    console.log('Disconnected from server', reason);
});

socket.on('connect_error', (error) => {
    console.log('Connection error:', error);
});
