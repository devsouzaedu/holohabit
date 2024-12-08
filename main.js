// Seleção dos elementos principais
const form = document.getElementById('habit-form');
const habitNameInput = document.getElementById('habit-name');
const habitsContainer = document.getElementById('habits-container');
const users = JSON.parse(localStorage.getItem('users')) || []; // Usuários armazenados

// Carregar o usuário logado
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    alert('Você precisa fazer login!');
    window.location.href = 'login.html';
}

// Armazena os hábitos do usuário no localStorage
let habits = currentUser.portfolio || [];

// Função para salvar os hábitos no localStorage
function saveHabits() {
    currentUser.portfolio = habits;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// Função para adicionar um novo hábito
function addHabit(name) {
    const startDate = new Date(); // Data e hora inicial
    const habit = {
        name,
        startDate,
        progress: 0, // Inicialmente nenhum dia completado
        timeLeft: 30, // Tempo restante para a próxima bolinha (em segundos)
        rewarded: false // Controle para evitar múltiplas recompensas
    };
    habits.push(habit);
    saveHabits();
    renderHabits();
}

// Função para renderizar os hábitos
function renderHabits() {
    habitsContainer.innerHTML = '<h2>Seus Hábitos</h2>'; // Reseta o container

    habits.forEach((habit, index) => {
        const habitElement = document.createElement('div');
        habitElement.classList.add('habit');

        // Nome do hábito
        const nameElement = document.createElement('div');
        nameElement.classList.add('habit-name');
        nameElement.textContent = habit.name;

        // Bolinhas de progresso
        const progressElement = document.createElement('div');
        progressElement.classList.add('habit-progress');

        // Criar as 7 bolinhas, que irão mudar de cor conforme o progresso
        for (let i = 0; i < 7; i++) {
            const day = document.createElement('div');
            day.classList.add('day');
            if (i < habit.progress) {
                day.classList.add('completed');
            }
            progressElement.appendChild(day);
        }

        // Contador de tempo restante
        const timerElement = document.createElement('div');
        timerElement.classList.add('habit-timer');
        timerElement.textContent = `Próxima bolinha: ${habit.timeLeft}s`;

        habitElement.appendChild(nameElement);
        habitElement.appendChild(progressElement);
        habitElement.appendChild(timerElement);

        // Botão de "Carta liberada" se o hábito for completo
        if (habit.progress === 7 && !habit.rewarded) {
            const rewardButton = document.createElement('button');
            rewardButton.classList.add('reward-button');
            rewardButton.textContent = 'Carta liberada, hábito em formação...';
            rewardButton.addEventListener('click', () => {
                const cardContainer = document.createElement('div');
                cardContainer.classList.add('card-reward');
                cardContainer.innerHTML = `
                    <img src="images/carta_teste.jpg" alt="Carta Teste">
                `;
                document.body.appendChild(cardContainer); // Exibe a carta na tela

                // Animação de tensão e ansiedade
                setTimeout(() => {
                    cardContainer.classList.add('reveal');
                    setTimeout(() => {
                        // Libera o botão de "Adicionar ao portfólio"
                        const addButton = document.createElement('button');
                        addButton.textContent = 'Adicionar carta ao portfólio';
                        addButton.addEventListener('click', () => {
                            habit.rewarded = true;
                            saveHabits();
                            alert('Carta adicionada ao seu portfólio!');
                            renderHabits();
                        });
                        cardContainer.appendChild(addButton);
                    }, 2000); // Atraso para a animação
                }, 500);
            });
            habitElement.appendChild(rewardButton);
        }

        habitsContainer.appendChild(habitElement);
    });
}

// Função para atualizar o progresso e o tempo restante
function updateProgress() {
    habits.forEach((habit) => {
        // Reduz o tempo restante
        habit.timeLeft--;

        // Quando o tempo chega a 0, adiciona uma bolinha
        if (habit.timeLeft <= 0) {
            if (habit.progress < 7) {
                habit.progress++;
            }

            // Reseta o tempo restante para 30 segundos
            habit.timeLeft = 30;
        }
    });

    saveHabits(); // Salva o progresso atualizado no localStorage
    renderHabits();
}

// Evento ao enviar o formulário
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const habitName = habitNameInput.value.trim();
    if (habitName) {
        addHabit(habitName);
        habitNameInput.value = ''; // Limpa o campo
    }
});

// Atualiza o progresso e o tempo restante a cada segundo
setInterval(updateProgress, 1000);

// Renderiza os hábitos ao carregar a página
renderHabits();
