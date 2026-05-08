// Aguardar o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function () {
    // Inicializa AOS
    AOS.init({ duration: 1000, once: true });

    // 1. Modo escuro
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
        darkModeToggle.checked = true;
    }

    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });

    // 2. Música de fundo
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    let musicPlaying = false;

    musicToggle.addEventListener('click', () => {
        if (musicPlaying) {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-music-slash"></i>';
            localStorage.setItem('musicPref', 'off');
        } else {
            bgMusic.play().catch(e => console.log('Reprodução automática bloqueada'));
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            localStorage.setItem('musicPref', 'on');
        }
        musicPlaying = !musicPlaying;
    });

    if (localStorage.getItem('musicPref') === 'on') {
        bgMusic.play().catch(e => { });
        musicPlaying = true;
        musicToggle.innerHTML = '<i class="fas fa-music"></i>';
    }

    // 3. Contador regressivo
    function updateCountdown() {
        const today = new Date();
        const year = today.getFullYear();
        let mothersDay = new Date(year, 4, 10);
        while (mothersDay.getDay() !== 0) mothersDay.setDate(mothersDay.getDate() + 1);
        if (today > mothersDay) mothersDay = new Date(year + 1, 4, 10);
        const diff = mothersDay - today;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (86400000)) / 3600000);
        document.getElementById('countdown').innerHTML = `${days} dias e ${hours} horas`;
    }

    updateCountdown();
    setInterval(updateCountdown, 3600000);

    // 4. Máquina de escrever
    const fullText = `Minha amada esposa,\n\nNeste Dia das Mães, quero te lembrar o quanto você é especial. Você não é apenas a melhor mãe que nossos filhos poderiam ter, mas também a mulher que ilumina minha vida todos os dias.\n\nSua dedicação, seu carinho e seu amor incondicional transformam nossa família em um lar cheio de alegria. Cada sorriso seu é um presente que guardo no coração.\n\nObrigado por ser essa mãe maravilhosa, por cuidar de nós com tanto amor e por tornar cada momento inesquecível.\n\nTe amo hoje, amanhã e para sempre! 💝\n\nCom todo o meu amor,\nSeu eterno admirador`;
    let index = 0;
    const typewriterElement = document.getElementById('typewriter-text');

    function typeWriter() {
        if (index < fullText.length) {
            typewriterElement.innerHTML += fullText.charAt(index);
            index++;
            setTimeout(typeWriter, 40);
        } else {
            typewriterElement.style.borderRight = 'none';
        }
    }

    typeWriter();

    // 5. Jogo da memória
    const emojis = ['❤️', '💖', '💗', '💓', '💝', '💕'];
    let gameCards = [...emojis, ...emojis];
    let flippedCards = [], matchedPairs = 0, lockBoard = false;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function renderGame() {
        const gameDiv = document.getElementById('memoryGame');
        gameDiv.innerHTML = '';
        const shuffledCards = shuffle([...gameCards]);
        shuffledCards.forEach((emoji, idx) => {
            const col = document.createElement('div');
            col.className = 'col-3';
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.innerHTML = `<div class="back"><i class="fas fa-heart fa-2x"></i></div><div class="front" style="font-size: 2rem;">${emoji}</div>`;
            card.dataset.index = idx;
            card.dataset.emoji = emoji;
            card.addEventListener('click', () => flipCard(card));
            col.appendChild(card);
            gameDiv.appendChild(col);
        });
    }

    function flipCard(card) {
        if (lockBoard || card.classList.contains('flipped')) return;
        card.classList.add('flipped');
        flippedCards.push(card);
        if (flippedCards.length === 2) {
            lockBoard = true;
            if (flippedCards[0].dataset.emoji === flippedCards[1].dataset.emoji) {
                matchedPairs++;
                flippedCards = [];
                lockBoard = false;
                if (matchedPairs === emojis.length) {
                    document.getElementById('gameStatus').innerHTML = '🎉 Você venceu! Parabéns! 🎉';
                    if (typeof canvasConfetti !== 'undefined') {
                        canvasConfetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });
                    }
                }
            } else {
                setTimeout(() => {
                    flippedCards.forEach(c => c.classList.remove('flipped'));
                    flippedCards = [];
                    lockBoard = false;
                }, 1000);
            }
        }
    }

    const resetBtn = document.getElementById('resetGame');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            matchedPairs = 0;
            flippedCards = [];
            lockBoard = false;
            renderGame();
            document.getElementById('gameStatus').innerHTML = 'Encontre os pares!';
        });
    }

    renderGame();

    // 6. Assinatura digital
    const canvas = document.getElementById('signatureCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let drawing = false;

        function resizeCanvas() {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#ff6b9d';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function startDrawing(e) {
            drawing = true;
            const pos = getMousePos(e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.stroke();
        }

        function draw(e) {
            if (!drawing) return;
            const pos = getMousePos(e);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        }

        function stopDrawing() {
            drawing = false;
            ctx.beginPath();
        }

        function getMousePos(e) {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
            const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            return { x, y };
        }

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('touchstart', startDrawing);
        canvas.addEventListener('touchmove', draw);
        canvas.addEventListener('touchend', stopDrawing);

        const clearBtn = document.getElementById('clearSignature');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            });
        }

        const saveBtn = document.getElementById('saveSignature');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const signatureData = canvas.toDataURL();
                localStorage.setItem('signature', signatureData);
                alert('Assinatura salva com amor! ❤️');
            });
        }

        const savedSignature = localStorage.getItem('signature');
        if (savedSignature) {
            const img = new Image();
            img.onload = () => ctx.drawImage(img, 0, 0);
            img.src = savedSignature;
        }
    }

    // 7. QR Code
    if (typeof QRCode !== 'undefined') {
        new QRCode(document.getElementById('qrcode'), {
            text: window.location.href,
            width: 150,
            height: 150,
            colorDark: '#ff6b9d',
            colorLight: '#ffffff'
        });

        // Gerar QR Code maior para impressão
        const printDiv = document.getElementById('qrPrintVersion');
        if (printDiv) {
            new QRCode(printDiv, {
                text: window.location.href,
                width: 400,
                height: 400,
                colorDark: '#ff6b9d',
                colorLight: '#ffffff'
            });
        }
    }

    // 8. Download QR Code
    const downloadBtn = document.getElementById('downloadQRCode');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            const qrImage = document.querySelector('#qrPrintVersion img');
            if (qrImage) {
                const link = document.createElement('a');
                link.download = 'qrcode-dia-das-maes.png';
                link.href = qrImage.src;
                link.click();
                this.innerHTML = '<i class="fas fa-check"></i> Baixado!';
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-download"></i> Baixar QR Code';
                }, 2000);
            }
        });
    }

    // 9. Imprimir QR Code
    const printBtn = document.getElementById('printQRCode');
    if (printBtn) {
        printBtn.addEventListener('click', function () {
            const qrImage = document.querySelector('#qrPrintVersion img');
            if (qrImage) {
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>QR Code - Dia das Mães</title>
                        <style>
                            @page { size: A4; margin: 2cm; }
                            body {
                                margin: 0;
                                padding: 20px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                min-height: 100vh;
                                background: linear-gradient(135deg, #ffe6f0 0%, #ffd9e8 100%);
                                font-family: 'Georgia', 'Times New Roman', serif;
                            }
                            .card {
                                background: white;
                                border-radius: 20px;
                                padding: 50px;
                                text-align: center;
                                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                                max-width: 700px;
                            }
                            .qr-code { margin: 30px 0; }
                            .qr-code img { width: 350px; height: 350px; }
                            h1 { color: #ff6b9d; font-size: 36px; margin: 20px 0; }
                            .message { color: #555; font-size: 18px; line-height: 1.6; margin: 20px 0; }
                            .hearts { font-size: 45px; letter-spacing: 10px; color: #ff6b9d; margin: 20px 0; }
                            .footer { margin-top: 30px; font-size: 14px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
                        </style>
                    </head>
                    <body>
                        <div class="card">
                            <div class="hearts">❤️ 💖 💗</div>
                            <h1>🌟 Feliz Dia das Mães! 🌟</h1>
                            <div class="qr-code"><img src="${qrImage.src}" alt="QR Code"></div>
                            <div class="message">
                                <strong>Querida mãe/esposa,</strong><br><br>
                                Escaneie este código com a câmera do seu celular<br>
                                para acessar uma homenagem especial que preparamos<br>
                                com todo o amor do mundo para você!<br><br>
                                💝 Você é a melhor mãe do mundo! 💝
                            </div>
                            <div class="hearts">💕 💞 💓</div>
                            <div class="footer">
                                Digitalize em: ${window.location.href}<br>
                                Com amor, sua família 💝
                            </div>
                        </div>
                        <script>window.onload = () => setTimeout(() => window.print(), 1000);<\/script>
                    </body>
                    </html>
                `);
                printWindow.document.close();
            }
        });
    }

    // 10. Compartilhar WhatsApp
    const shareBtn = document.getElementById('shareWhatsApp');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const text = encodeURIComponent('🌟 Feliz Dia das Mães! 🌟 Recebi uma homenagem especial. Acesse: ' + window.location.href);
            window.open(`https://wa.me/?text=${text}`, '_blank');
        });
    }

    function createFallingPetal() {
        const petal = document.createElement('div');
        petal.innerHTML = '🌹';
        petal.style.position = 'fixed';
        petal.style.pointerEvents = 'none';
        petal.style.zIndex = '998';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.top = '-20px';
        petal.style.fontSize = (Math.random() * 20 + 15) + 'px';
        petal.style.opacity = '0.8';
        petal.style.animation = 'swayFall ' + (Math.random() * 4 + 3) + 's linear forwards';

        // Animação de balanço customizada
        const keyframes = `
        @keyframes swayFall {
            0% {
                transform: translateY(-20px) rotate(0deg);
                opacity: 1;
            }
            25% {
                transform: translateY(25vh) rotate(90deg);
            }
            50% {
                transform: translateY(50vh) rotate(180deg);
            }
            75% {
                transform: translateY(75vh) rotate(270deg);
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;

        const styleSheet = document.createElement("style");
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);

        document.body.appendChild(petal);

        setTimeout(() => {
            if (petal && petal.remove) petal.remove();
            if (styleSheet && styleSheet.remove) styleSheet.remove();
        }, 8000);
    }

    // Ativar pétalas mais delicadas (opcional, combina com as rosas)
    setInterval(() => {
        for (let i = 0; i < 2; i++) {
            setTimeout(() => createFallingPetal(), i * 300);
        }
    }, 2000);


    // ============================================
    // CORAÇÕES FLUTUANTES - VERSÃO COMPLETA 💖
    // ============================================

    // Array de tipos de corações
    const heartTypes = ['❤️', '💖', '💗', '💓', '💝', '💕', '💞', '💟', '❣️', '🧡', '💛', '💚', '💙', '💜'];

    // Cores de corações para confete
    const heartColors = ['#ff0000', '#ff1744', '#ff69b4', '#ff1493', '#ff6b9d', '#ff3b7d'];

    // 1. Coração flutuante básico (sobe do chão)
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];

        // Posição horizontal aleatória
        heart.style.left = Math.random() * 100 + '%';

        // Tamanho variado (20px a 50px)
        const size = Math.random() * 30 + 20;
        heart.style.fontSize = size + 'px';

        // Duração variada (5 a 10 segundos)
        const duration = Math.random() * 5 + 5;
        heart.style.animationDuration = duration + 's';

        // Atraso aleatório
        heart.style.animationDelay = (Math.random() * 2) + 's';

        document.body.appendChild(heart);

        // Remover após animação
        setTimeout(() => {
            if (heart && heart.remove) heart.remove();
        }, duration * 1000);
    }

    // 2. Chuva de corações (caindo do topo)
    function createRainHeart() {
        const heart = document.createElement('div');
        heart.className = 'rain-heart';
        heart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];

        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = '-20px';

        const size = Math.random() * 25 + 15;
        heart.style.fontSize = size + 'px';

        const duration = Math.random() * 4 + 3;
        heart.style.animationDuration = duration + 's';

        document.body.appendChild(heart);

        setTimeout(() => {
            if (heart && heart.remove) heart.remove();
        }, duration * 1000);
    }

    // 3. Explosão de corações (muitos corações de uma vez)
    function heartExplosion(centerX = window.innerWidth / 2, centerY = window.innerHeight / 2) {
        const count = 30;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'floating-heart';
                heart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];

                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 200;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;

                heart.style.left = (x / window.innerWidth * 100) + '%';
                heart.style.top = (y / window.innerHeight * 100) + '%';

                const size = Math.random() * 30 + 20;
                heart.style.fontSize = size + 'px';
                heart.style.animationDuration = (Math.random() * 3 + 2) + 's';

                document.body.appendChild(heart);
                setTimeout(() => heart.remove(), 5000);
            }, i * 20);
        }
    }

    // 4. Onda de corações (vai da esquerda pra direita)
    function createHeartWave() {
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'wave-heart';
                heart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];

                const yPosition = Math.random() * window.innerHeight;
                heart.style.left = '-50px';
                heart.style.top = yPosition + 'px';
                heart.style.fontSize = (Math.random() * 30 + 15) + 'px';

                document.body.appendChild(heart);
                setTimeout(() => heart.remove(), 2000);
            }, i * 100);
        }
    }

    // 5. Corações pulsantes (ficam no lugar pulsando)
    function createPulseHeart(x, y) {
        const heart = document.createElement('div');
        heart.className = 'pulse-heart';
        heart.innerHTML = '💖';
        heart.style.position = 'fixed';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.fontSize = '40px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        heart.style.opacity = '1';

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.style.transition = 'opacity 1s';
            heart.style.opacity = '0';
            setTimeout(() => heart.remove(), 1000);
        }, 2000);
    }

    // 6. Sinal de corações (corações que sobem em linha)
    function sendHeartSignal() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'floating-heart';
                heart.innerHTML = '💖';
                heart.style.left = (window.innerWidth / 2) + 'px';
                heart.style.fontSize = (30 + i * 2) + 'px';
                heart.style.animationDuration = (3 + i * 0.2) + 's';
                document.body.appendChild(heart);
                setTimeout(() => heart.remove(), 5000);
            }, i * 100);
        }
    }

    // 7. CORAÇÕES NO CLICK (qualquer lugar da tela)
    document.body.addEventListener('click', (e) => {
        // Não disparar se clicou em botão (pra não conflitar)
        if (e.target.closest('button')) return;

        // Criar coração no local do clique
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];
        heart.style.left = (e.clientX - 20) + 'px';
        heart.style.top = (e.clientY - 20) + 'px';
        heart.style.fontSize = '35px';
        heart.style.animationDuration = '2s';
        heart.style.position = 'fixed';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 2000);

        // Criar mais 5 corações ao redor
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const extraHeart = document.createElement('div');
                extraHeart.className = 'floating-heart';
                extraHeart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];
                const angle = Math.random() * Math.PI * 2;
                const offsetX = Math.cos(angle) * 50;
                const offsetY = Math.sin(angle) * 50;
                extraHeart.style.left = (e.clientX + offsetX - 20) + 'px';
                extraHeart.style.top = (e.clientY + offsetY - 20) + 'px';
                extraHeart.style.fontSize = (Math.random() * 30 + 15) + 'px';
                extraHeart.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
                extraHeart.style.position = 'fixed';
                document.body.appendChild(extraHeart);
                setTimeout(() => extraHeart.remove(), 2000);
            }, i * 50);
        }
    });

    // 8. CORAÇÕES EM POLAROIDS (clicar nas fotos)
    document.querySelectorAll('.polaroid').forEach(polaroid => {
        polaroid.addEventListener('click', (e) => {
            // Corações especiais para as fotos
            const rect = polaroid.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const heart = document.createElement('div');
                    heart.className = 'floating-heart';
                    heart.innerHTML = '💖';
                    heart.style.left = (centerX + (Math.random() - 0.5) * 100) + 'px';
                    heart.style.top = (centerY + (Math.random() - 0.5) * 100) + 'px';
                    heart.style.fontSize = (Math.random() * 30 + 20) + 'px';
                    heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
                    document.body.appendChild(heart);
                    setTimeout(() => heart.remove(), 5000);
                }, i * 30);
            }
        });
    });

    // 9. CORAÇÕES NO JOGO DA MEMÓRIA (quando acerta um par)
    // Adicionar ao final da função flipCard, dentro do if(matchedPairs)
    // Coloque esta linha onde o jogador acerta um par:
    // for(let i = 0; i < 10; i++) setTimeout(() => createFloatingHeart(), i * 50);

    // 10. CORAÇÕES NO VÍDEO (quando alguém clicar no vídeo)
    const videoPlaceholder = document.getElementById('videoPlaceholder');
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', () => {
            for (let i = 0; i < 30; i++) {
                setTimeout(() => createFloatingHeart(), i * 30);
            }
        });
    }

    // ============================================
    // ATIVAR TODOS OS SISTEMAS DE CORAÇÕES
    // ============================================

    // Ativar corações flutuantes contínuos (a cada 2 segundos)
    setInterval(() => {
        // Criar de 1 a 4 corações flutuantes
        const heartsCount = Math.floor(Math.random() * 4) + 1;
        for (let i = 0; i < heartsCount; i++) {
            setTimeout(() => createFloatingHeart(), i * 300);
        }
    }, 1500);

    // Ativar chuva de corações (a cada 5 segundos, cai um coração)
    setInterval(() => {
        createRainHeart();
        // Às vezes cai mais de um
        if (Math.random() > 0.7) {
            setTimeout(() => createRainHeart(), 200);
        }
    }, 4000);

    // Ativar onda de corações a cada 15 segundos
    setInterval(() => {
        createHeartWave();
    }, 15000);

    // Corações aleatórios pela página
    setInterval(() => {
        // 20% de chance de explosão de corações
        if (Math.random() > 0.8) {
            heartExplosion();
        }
    }, 10000);

    // ============================================
    // BOTÃO DE CORAÇÕES (adicional garantido)
    // ============================================

    // Criar botão de corações se não existir
    if (!document.getElementById('heartsButton')) {
        const heartsButton = document.createElement('button');
        heartsButton.id = 'heartsButton';
        heartsButton.innerHTML = '💖💗💓';
        heartsButton.style.position = 'fixed';
        heartsButton.style.bottom = '90px';
        heartsButton.style.left = '20px';
        heartsButton.style.zIndex = '1000';
        heartsButton.style.background = '#ff1744';
        heartsButton.style.color = 'white';
        heartsButton.style.border = 'none';
        heartsButton.style.borderRadius = '50px';
        heartsButton.style.padding = '10px 15px';
        heartsButton.style.fontSize = '16px';
        heartsButton.style.cursor = 'pointer';
        heartsButton.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        heartsButton.style.transition = 'all 0.3s';

        heartsButton.addEventListener('click', () => {
            // Explosão de corações!
            heartExplosion();
            // Mais corações extras
            for (let i = 0; i < 30; i++) {
                setTimeout(() => createFloatingHeart(), i * 20);
            }
            // Chuva extra
            for (let i = 0; i < 15; i++) {
                setTimeout(() => createRainHeart(), i * 100);
            }
            // Confetes de corações
            if (typeof canvasConfetti !== 'undefined') {
                canvasConfetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.5 },
                    colors: heartColors
                });
            }

            // Feedback
            heartsButton.innerHTML = '💝 CORAÇÕES! 💝';
            setTimeout(() => {
                heartsButton.innerHTML = '💖💗💓';
            }, 2000);
        });

        heartsButton.addEventListener('mouseenter', () => {
            heartsButton.style.transform = 'scale(1.1)';
        });

        heartsButton.addEventListener('mouseleave', () => {
            heartsButton.style.transform = 'scale(1)';
        });

        document.body.appendChild(heartsButton);
    }

    // ============================================
    // CORAÇÕES NO MODAL (quando abrir)
    // ============================================
    const heartsModal = document.getElementById('bestMomModal');
    if (heartsModal) {
        heartsModal.addEventListener('shown.bs.modal', () => {
            // Explosão de corações quando modal abrir
            heartExplosion(window.innerWidth / 2, window.innerHeight / 2);
            // Sinal de corações
            sendHeartSignal();
            // Chuva intensa
            for (let i = 0; i < 30; i++) {
                setTimeout(() => createRainHeart(), i * 50);
            }
        });
    }

    // ============================================
    // CORAÇÕES NO SCROLL (rolar a página)
    // ============================================
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Criar alguns corações quando rolar
            for (let i = 0; i < 3; i++) {
                setTimeout(() => createFloatingHeart(), i * 100);
            }
        }, 200);
    });

    // ============================================
    // CORAÇÕES NO CARREGAMENTO DA PÁGINA
    // ============================================
    window.addEventListener('load', () => {
        // Muitos corações ao carregar
        setTimeout(() => {
            heartExplosion();
            sendHeartSignal();
            for (let i = 0; i < 50; i++) {
                setTimeout(() => createFloatingHeart(), i * 50);
            }
        }, 1000);
    });

    // Console log de confirmação
    console.log('💖 Sistema de corações ativado! 💖');
    console.log('❤️ Clique em qualquer lugar para mais corações! ❤️');
    console.log('💗 Botão de corações no canto inferior esquerdo! 💗');

    // 13. Modal e confetes
    const modalElement = document.getElementById('bestMomModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        window.addEventListener('load', () => {
            setTimeout(() => {
                modal.show();
                if (typeof canvasConfetti !== 'undefined') {
                    canvasConfetti({ particleCount: 300, spread: 100, origin: { y: 0.6 }, colors: ['#ff6b9d', '#ff1493', '#ff69b4'] });
                }
                for (let i = 0; i < 60; i++) {
                    setTimeout(() => createFloatingHeart(), i * 30);
                }
            }, 500);
        });
    }

    // 14. Efeitos click nas polaroids
    document.querySelectorAll('.polaroid').forEach(p => {
        p.addEventListener('click', () => {
            for (let i = 0; i < 10; i++) setTimeout(() => createFloatingHeart(), i * 50);
        });
    });
});