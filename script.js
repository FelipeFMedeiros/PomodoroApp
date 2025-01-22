class PomodoroTimer {
    constructor() {
        this.timeLeft = 25 * 60; // 25 minutos em segundos
        this.initialTime = this.timeLeft;
        this.isRunning = false;
        this.timer = null;

        // Elemetnos do DOM
        this.timerDisplay = document.querySelector('.timer');
        this.toggleBtn = document.getElementById('toggle');
        this.resetBtn = document.getElementById('reset');
        this.timeOptions = document.querySelectorAll('.time-option');

        // Elementos dos botões para alternar
        this.toggleBtnIcon = this.toggleBtn.querySelector('i');
        this.toggleBtnText = this.toggleBtn.querySelector('span');

        // Adicionar ouvintes de eventos
        this.toggleBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.timeOptions.forEach((option) => {
            option.addEventListener('click', (e) => this.setTime(e));
        });

        // Renderização inicial
        this.updateDisplay();
        this.updateToggleButton();
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
        this.updateToggleButton();
    }

    updateToggleButton() {
        if (this.isRunning) {
            this.toggleBtnIcon.className = 'fa-solid fa-pause';
            this.toggleBtnText.textContent = 'Pause';
            this.toggleBtn.style.backgroundColor = '#e11d48'; // Vermelho para pausar
        } else {
            this.toggleBtnIcon.className = 'fa-solid fa-play';
            // Verifica se o timer já começou mas está pausado
            this.toggleBtnText.textContent = this.timeLeft < this.initialTime ? 'Resume' : 'Start';
            this.toggleBtn.style.backgroundColor = ''; // Volta para a cor padrão (--primary)
        }
    }

    setTime(e) {
        if (this.isRunning) return;

        this.timeOptions.forEach((option) => option.classList.remove('active'));
        e.target.classList.add('active');

        const minutes = parseInt(e.target.dataset.time);
        this.timeLeft = minutes * 60;
        this.initialTime = this.timeLeft;
        this.updateDisplay();
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.timer = setInterval(() => {
            this.timeLeft--;

            if (this.timeLeft < 0) {
                this.timeLeft = 0;
                this.pause();
                this.notifyTimeUp();
            }

            this.updateDisplay();
        }, 1000);
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timer);
        this.updateToggleButton();
    }

    reset() {
        this.pause();
        this.timeLeft = this.initialTime;
        this.updateDisplay();
        this.updateToggleButton();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;

        this.timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    notifyTimeUp() {
        // Solicitar permissão de notificação se não for concedida
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // Mostrar notificação se a permissão for concedida
        if (Notification.permission === 'granted') {
            new Notification('Tempo Finalizado!', {
                body: 'Seu tempo Pomodoro acabou!',
                icon: 'https://cdn-icons-png.flaticon.com/512/850/850960.png',
            });
        }

        // Tocar notificação de áudio
        const audio = new Audio(
            'data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8eleP',
        );
        audio.play().catch((e) => console.log('Erro ao tocar áudio:', e));
    }
}

// Solicitar permissão de notificação quando a página carregar
if (Notification.permission === 'default') {
    Notification.requestPermission();
}

// Inicializar o timer
const pomodoroTimer = new PomodoroTimer();
