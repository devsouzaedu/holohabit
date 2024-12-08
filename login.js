// Seleção do formulário de login
const loginForm = document.getElementById('login-form');

// Dados de login de exemplo (simulação)
const users = [
    { username: 'usuario1', password: 'senha123', portfolio: [] }
];

// Função de login
function login(username, password) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        // Armazenando usuário autenticado no localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        // Redireciona para a página principal
        window.location.href = 'main.html';
    } else {
        alert('Credenciais inválidas');
    }
}

// Evento de submit do formulário de login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    login(username, password);
});
