const modeSelect = document.getElementById('mode-select');
const singleControls = document.getElementById('single-controls');
const multiControls = document.getElementById('multi-controls');
const surahSelect = document.getElementById('surah-select');
const surahSelectStart = document.getElementById('surah-select-start');
const surahSelectEnd = document.getElementById('surah-select-end');
const pickAyahButton = document.getElementById('pick-ayah');
const ayahDisplay = document.getElementById('ayah-display');
const ayahNumber = document.getElementById('ayah-number');
const ayahText = document.getElementById('ayah-text');
const checkAnswerButton = document.getElementById('check-answer');
const answerDisplay = document.getElementById('answer-display');
const followingAyahs = document.getElementById('following-ayahs');
const ayahCountInput = document.getElementById('ayah-count');

const readingModeBtn = document.getElementById('reading-mode');
const readingDisplay = document.getElementById('reading-display');
const readingSurahSelect = document.getElementById('reading-surah-select');
const surahTitle = document.getElementById('surah-title');
const surahText = document.getElementById('surah-text');

const bookmarkBtn = document.getElementById('bookmark-btn');
const bookmarksList = document.getElementById('bookmarks-list');

const historyModeBtn = document.getElementById('history-mode');
const historyDisplay = document.getElementById('history-display');
const historyList = document.getElementById('history-list');

const memorizationHistoryBtn = document.getElementById('memorization-history-btn');
const memorizationHistoryDisplay = document.getElementById('memorization-history-display');
const memorizationHistoryList = document.getElementById('memorization-history-list');

const moodModeBtn = document.getElementById('mood-mode');
const moodDisplay = document.getElementById('mood-display');

const listeningModeBtn = document.getElementById('listening-mode');
const listeningDisplay = document.getElementById('listening-display');
const reciterSelect = document.getElementById('reciter-select');
const listeningsurahSelect = document.getElementById('listening-surah-select');
const ayahSelect = document.getElementById('ayah-select');
const quranAudio = document.getElementById('quran-audio');
const prevAyahBtn = document.getElementById('prev-ayah');
const nextAyahBtn = document.getElementById('next-ayah');

let quranData = null;
let currentAyah = null;
let followingAyahsList = [];
let bookmarks = JSON.parse(localStorage.getItem('quranBookmarks')) || [];
let ayahBookmarks = JSON.parse(localStorage.getItem('quranAyahBookmarks')) || [];
let readingHistory = JSON.parse(localStorage.getItem('quranReadingHistory')) || [];

let isDarkMode = true;
let currentReciter = null;
let currentAudioAyah = null;

async function fetchQuranData() {
    try {
        const response = await fetch('quran.json');
        const rawData = await response.json();
        quranData = Object.keys(rawData).map(surahNum => {
            const ayahsArray = rawData[surahNum].map((item, index) => {
                return {
                    text: item.text,
                    numberInSurah: index + 1,
                    surah: { number: parseInt(surahNum) }
                };
            });
            return {
                number: parseInt(surahNum),
                name: 'Surah ' + surahNum,
                englishName: 'Surah ' + surahNum,
                ayahs: ayahsArray
            };
        });
        populateSurahSelects();
    } catch (error) {
        console.error('Error fetching local quran.json:', error);
    }
}

function populateSurahSelects() {
    const surahNames = [
        "Al-Fatihah (الفاتحة)",
        "Al-Baqarah (البقرة)",
        "Ali 'Imran (آل عمران)",
        "An-Nisa' (النساء)",
        "Al-Ma'idah (المائدة)",
        "Al-An'am (الأنعام)",
        "Al-A'raf (الأعراف)",
        "Al-Anfal (الأنفال)",
        "At-Tawbah (التوبة)",
        "Yunus (يونس)",
        "Hud (هود)",
        "Yusuf (يوسف)",
        "Ar-Ra'd (الرعد)",
        "Ibrahim (ابراهيم)",
        "Al-Hijr (الحجر)",
        "An-Nahl (النحل)",
        "Al-Isra' (الإسراء)",
        "Al-Kahf (الكهف)",
        "Maryam (مريم)",
        "Ta-Ha (طه)",
        "Al-Anbiya' (الأنبياء)",
        "Al-Hajj (الحج)",
        "Al-Mu'minun (المؤمنون)",
        "An-Nur (النور)",
        "Al-Furqan (الفرقان)",
        "Ash-Shu'ara' (الشعراء)",
        "An-Naml (النمل)",
        "Al-Qasas (القصص)",
        "Al-'Ankabut (العنكبوت)",
        "Ar-Rum (الروم)",
        "Luqman (لقمان)",
        "As-Sajdah (السجدة)",
        "Al-Ahzab (الأحزاب)",
        "Saba' (سبإ)",
        "Fatir (فاطر)",
        "Ya-Sin (يس)",
        "As-Saffat (الصافات)",
        "Sad (ص)",
        "Az-Zumar (الزمر)",
        "Ghafir (غافر)",
        "Fussilat (فصلت)",
        "Ash-Shura (الشورى)",
        "Az-Zukhruf (الزخرف)",
        "Ad-Dukhan (الدخان)",
        "Al-Jathiyah (الجاثية)",
        "Al-Ahqaf (الأحقاف)",
        "Muhammad (محمد)",
        "Al-Fath (الفتح)",
        "Al-Hujurat (الحجرات)",
        "Qaf (ق)",
        "Adh-Dhariyat (الذاريات)",
        "At-Tur (الطور)",
        "An-Najm (النجم)",
        "Al-Qamar (القمر)",
        "Ar-Rahman (الرحمن)",
        "Al-Waqi'ah (الواقعة)",
        "Al-Hadid (الحديد)",
        "Al-Mujadilah (المجادلة)",
        "Al-Hashr (الحشر)",
        "Al-Mumtahanah (الممتحنة)",
        "As-Saff (الصف)",
        "Al-Jumu'ah (الجمعة)",
        "Al-Munafiqun (المنافقون)",
        "At-Taghabun (التغابن)",
        "At-Talaq (الطلاق)",
        "At-Tahrim (التحريم)",
        "Al-Mulk (الملك)",
        "Al-Qalam (القلم)",
        "Al-Haqqah (الحاقة)",
        "Al-Ma'arij (المعارج)",
        "Nuh (نوح)",
        "Al-Jinn (الجن)",
        "Al-Muzzammil (المزمل)",
        "Al-Muddaththir (المدثر)",
        "Al-Qiyamah (القيامة)",
        "Al-Insan (الانسان)",
        "Al-Mursalat (المرسلات)",
        "An-Naba' (النبإ)",
        "An-Nazi'at (النازعات)",
        "'Abasa (عبس)",
        "At-Takwir (التكوير)",
        "Al-Infitar (الإنفطار)",
        "Al-Mutaffifin (المطففين)",
        "Al-Inshiqaq (الإنشقاق)",
        "Al-Buruj (البروج)",
        "At-Tariq (الطارق)",
        "Al-A'la (الأعلى)",
        "Al-Ghashiyah (الغاشية)",
        "Al-Fajr (الفجر)",
        "Al-Balad (البلد)",
        "Ash-Shams (الشمس)",
        "Al-Layl (الليل)",
        "Ad-Duha (الضحى)",
        "Ash-Sharh (الشرح)",
        "At-Tin (التين)",
        "Al-'Alaq (العلق)",
        "Al-Qadr (القدر)",
        "Al-Bayyinah (البينة)",
        "Az-Zalzalah (الزلزلة)",
        "Al-'Adiyat (العاديات)",
        "Al-Qari'ah (القارعة)",
        "At-Takathur (التكاثر)",
        "Al-'Asr (العصر)",
        "Al-Humazah (الهمزة)",
        "Al-Fil (الفيل)",
        "Quraysh (قريش)",
        "Al-Ma'un (الماعون)",
        "Al-Kawthar (الكوثر)",
        "Al-Kafirun (الكافرون)",
        "An-Nasr (النصر)",
        "Al-Masad (المسد)",
        "Al-Ikhlas (الإخلاص)",
        "Al-Falaq (الفلق)",
        "An-Nas (الناس)"
    ];

    const selectElements = [surahSelect, surahSelectStart, surahSelectEnd, readingSurahSelect, listeningsurahSelect];
    selectElements.forEach(select => {
        for (let i = 0; i < surahNames.length; i++) {
            const option = document.createElement('option');
            option.value = i + 1;
            option.textContent = `${i + 1}. ${surahNames[i]}`;
            select.appendChild(option);
        }
    });
}

const singleModeBtn = document.getElementById('single-mode');
const multipleModeBtn = document.getElementById('multiple-mode');

singleModeBtn.addEventListener('click', () => {
    const isActive = singleModeBtn.classList.contains('active');
    if (isActive) {
        singleModeBtn.classList.remove('active');
        singleControls.classList.add('hidden');
        pickAyahButton.classList.add('hidden');
    } else {
        singleModeBtn.classList.add('active');
        multipleModeBtn.classList.remove('active');
        readingModeBtn.classList.remove('active');
        historyModeBtn.classList.remove('active');
        memorizationHistoryBtn.classList.remove('active');
        moodModeBtn.classList.remove('active');
        listeningModeBtn.classList.remove('active');
        singleControls.classList.remove('hidden');
        multiControls.classList.add('hidden');
        readingDisplay.classList.add('hidden');
        historyDisplay.classList.add('hidden');
        memorizationHistoryDisplay.classList.add('hidden');
        moodDisplay.classList.add('hidden');
        listeningDisplay.classList.add('hidden');
        pickAyahButton.classList.remove('hidden');
    }
});

multipleModeBtn.addEventListener('click', () => {
    const isActive = multipleModeBtn.classList.contains('active');
    if (isActive) {
        multipleModeBtn.classList.remove('active');
        multiControls.classList.add('hidden');
        pickAyahButton.classList.add('hidden');
    } else {
        multipleModeBtn.classList.add('active');
        singleModeBtn.classList.remove('active');
        readingModeBtn.classList.remove('active');
        historyModeBtn.classList.remove('active');
        memorizationHistoryBtn.classList.remove('active');
        moodModeBtn.classList.remove('active');
        listeningModeBtn.classList.remove('active');
        singleControls.classList.add('hidden');
        multiControls.classList.remove('hidden');
        readingDisplay.classList.add('hidden');
        historyDisplay.classList.add('hidden');
        memorizationHistoryDisplay.classList.add('hidden');
        moodDisplay.classList.add('hidden');
        listeningDisplay.classList.add('hidden');
        pickAyahButton.classList.remove('hidden');
    }
});

readingModeBtn.addEventListener('click', () => {
    const isActive = readingModeBtn.classList.contains('active');
    if (isActive) {
        readingModeBtn.classList.remove('active');
        readingDisplay.classList.add('hidden');
    } else {
        readingModeBtn.classList.add('active');
        singleModeBtn.classList.remove('active');
        multipleModeBtn.classList.remove('active');
        historyModeBtn.classList.remove('active');
        memorizationHistoryBtn.classList.remove('active');
        moodModeBtn.classList.remove('active');
        listeningModeBtn.classList.remove('active');
        singleControls.classList.add('hidden');
        multiControls.classList.add('hidden');
        ayahDisplay.classList.add('hidden');
        answerDisplay.classList.add('hidden');
        readingDisplay.classList.remove('hidden');
        historyDisplay.classList.add('hidden');
        memorizationHistoryDisplay.classList.add('hidden');
        moodDisplay.classList.add('hidden');
        listeningDisplay.classList.add('hidden');
        pickAyahButton.classList.add('hidden');
    }
});

historyModeBtn.addEventListener('click', () => {
    const isActive = historyModeBtn.classList.contains('active');
    if (isActive) {
        historyModeBtn.classList.remove('active');
        historyDisplay.classList.add('hidden');
    } else {
        historyModeBtn.classList.add('active');
        singleModeBtn.classList.remove('active');
        multipleModeBtn.classList.remove('active');
        readingModeBtn.classList.remove('active');
        memorizationHistoryBtn.classList.remove('active');
        moodModeBtn.classList.remove('active');
        listeningModeBtn.classList.remove('active');
        singleControls.classList.add('hidden');
        multiControls.classList.add('hidden');
        ayahDisplay.classList.add('hidden');
        answerDisplay.classList.add('hidden');
        readingDisplay.classList.add('hidden');
        historyDisplay.classList.remove('hidden');
        memorizationHistoryDisplay.classList.add('hidden');
        moodDisplay.classList.add('hidden');
        listeningDisplay.classList.add('hidden');
        pickAyahButton.classList.add('hidden');
        updateHistoryList();
    }
});

memorizationHistoryBtn.addEventListener('click', () => {
    const isActive = memorizationHistoryBtn.classList.contains('active');
    if (isActive) {
        memorizationHistoryBtn.classList.remove('active');
        memorizationHistoryDisplay.classList.add('hidden');
    } else {
        memorizationHistoryBtn.classList.add('active');
        singleModeBtn.classList.remove('active');
        multipleModeBtn.classList.remove('active');
        readingModeBtn.classList.remove('active');
        historyModeBtn.classList.remove('active');
        moodModeBtn.classList.remove('active');
        listeningModeBtn.classList.remove('active');
        singleControls.classList.add('hidden');
        multiControls.classList.add('hidden');
        ayahDisplay.classList.add('hidden');
        answerDisplay.classList.add('hidden');
        readingDisplay.classList.add('hidden');
        historyDisplay.classList.add('hidden');
        memorizationHistoryDisplay.classList.remove('hidden');
        moodDisplay.classList.add('hidden');
        listeningDisplay.classList.add('hidden');
        pickAyahButton.classList.add('hidden');
        updateMemorizationHistoryList();
    }
});

moodModeBtn.addEventListener('click', () => {
    const isActive = moodModeBtn.classList.contains('active');
    if (isActive) {
        moodModeBtn.classList.remove('active');
        moodDisplay.classList.add('hidden');
    } else {
        singleModeBtn.classList.remove('active');
        multipleModeBtn.classList.remove('active');
        readingModeBtn.classList.remove('active');
        historyModeBtn.classList.remove('active');
        memorizationHistoryBtn.classList.remove('active');
        listeningModeBtn.classList.remove('active');
        
        singleControls.classList.add('hidden');
        multiControls.classList.add('hidden');
        ayahDisplay.classList.add('hidden');
        answerDisplay.classList.add('hidden');
        readingDisplay.classList.add('hidden');
        historyDisplay.classList.add('hidden');
        memorizationHistoryDisplay.classList.add('hidden');
        
        moodModeBtn.classList.add('active');
        moodDisplay.classList.remove('hidden');
        listeningDisplay.classList.add('hidden');
    }
});

listeningModeBtn.addEventListener('click', async () => {
    const isActive = listeningModeBtn.classList.contains('active');
    if (isActive) {
        listeningModeBtn.classList.remove('active');
        listeningDisplay.classList.add('hidden');
        quranAudio.pause();
    } else {
        // Hide all other displays and deactivate other modes
        const displays = [singleControls, multiControls, readingDisplay, historyDisplay, 
                         memorizationHistoryDisplay, moodDisplay, ayahDisplay, answerDisplay];
        displays.forEach(display => display.classList.add('hidden'));
        
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        
        listeningModeBtn.classList.add('active');
        listeningDisplay.classList.remove('hidden');
        
        // Initialize reciters if not already done
        if (!reciterSelect.children.length) {
            const reciters = await fetchReciters();
            populateReciters(reciters);
        }
    }
});

pickAyahButton.addEventListener('click', () => {
    let selectedAyah;
    const isSingleMode = singleModeBtn.classList.contains('active');
    
    if (isSingleMode) {
        const surahIndex = parseInt(surahSelect.value) - 1;
        const selectedSurah = quranData[surahIndex];
        const randomAyahIndex = Math.floor(Math.random() * selectedSurah.ayahs.length);
        selectedAyah = selectedSurah.ayahs[randomAyahIndex];
    } else {
        const startSurah = parseInt(surahSelectStart.value);
        const endSurah = parseInt(surahSelectEnd.value);
        const validSurahs = quranData.slice(startSurah - 1, endSurah);
        const randomSurah = validSurahs[Math.floor(Math.random() * validSurahs.length)];
        const randomAyahIndex = Math.floor(Math.random() * randomSurah.ayahs.length);
        selectedAyah = randomSurah.ayahs[randomAyahIndex];
    }

    displayAyah(selectedAyah);
});

function displayAyah(ayah) {
    currentAyah = ayah;
    const bookmarkId = `${ayah.surah.number}:${ayah.numberInSurah}`;
    const isBookmarked = ayahBookmarks.some(b => b.id === bookmarkId);
    
    ayahNumber.textContent = `${ayah.surah.number}:${ayah.numberInSurah}`;
    ayahText.textContent = ayah.text;
    
    const bookmarkHtml = `
        <button class="ayah-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                onclick="toggleCurrentAyahBookmark()">
            <span class="bookmark-icon">☆</span>
        </button>
    `;
    
    ayahDisplay.classList.remove('hidden');
    answerDisplay.classList.add('hidden');
    
    ayahNumber.insertAdjacentHTML('afterend', bookmarkHtml);
    addToHistory('ayah', {
        surah: ayah.surah.number,
        ayah: ayah.numberInSurah
    });
}

checkAnswerButton.addEventListener('click', () => {
    const ayahCount = parseInt(ayahCountInput.value) || 3;
    const surah = quranData[currentAyah.surah.number - 1];
    const currentIndex = currentAyah.numberInSurah - 1;
    
    followingAyahsList = surah.ayahs
        .slice(currentIndex + 1, currentIndex + 1 + ayahCount)
        .map(ayah => ayah.text);

    followingAyahs.innerHTML = followingAyahsList
        .map(text => `<li>${text}</li>`)
        .join('');

    answerDisplay.classList.remove('hidden');
    addToHistory('test', {
        surah: currentAyah.surah.number,
        ayah: currentAyah.numberInSurah,
        correct: null
    });

    const existingMarkAnswer = answerDisplay.querySelector('.mark-answer');
    if (existingMarkAnswer) existingMarkAnswer.remove();

    const markAnswerHtml = `
        <div class="mark-answer">
            <button onclick="markAnswer(true)" class="btn-primary">Correct</button>
            <button onclick="markAnswer(false)" class="btn-primary">Incorrect</button>
        </div>
    `;
    answerDisplay.insertAdjacentHTML('beforeend', markAnswerHtml);
});

function markAnswer(correct) {
    const lastHistoryItem = readingHistory.find(item => item.type === 'test' && item.details.correct === null);
    if (lastHistoryItem) {
        lastHistoryItem.details.correct = correct;
        localStorage.setItem('quranReadingHistory', JSON.stringify(readingHistory));
        updateHistoryList();
    }
    pickAyahButton.click();
}

function displayFullSurah(surahNumber) {
    const surah = quranData[surahNumber - 1];
    const isBookmarked = bookmarks.some(b => b.surah === surahNumber);
    surahTitle.innerHTML = `
        سورة ${surah.name}
        <button class="surah-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}"
                onclick="toggleBookmark(${surahNumber})">
            <span class="bookmark-icon">☆</span>
        </button>
    `;
    surahText.innerHTML = surah.ayahs.map((ayah, index) => {
        const ayahBookmarkId = `${surahNumber}:${index+1}`;
        const isAyahBookmarked = ayahBookmarks.some(b => b.id === ayahBookmarkId);
        return `
            <div class="ayah-container">
                <span class="ayah-number">${index + 1}.</span>
                <span class="ayah-text">${ayah.text}</span>
                <button class="ayah-bookmark-btn ${isAyahBookmarked ? 'bookmarked' : ''}"
                        onclick="toggleAyahBookmark(${surahNumber}, ${index + 1})">
                    <span class="bookmark-icon">☆</span>
                </button>
            </div>
        `;
    }).join('');
    addToHistory('surah', {
        surah: surahNumber
    });
}

readingSurahSelect.addEventListener('change', (e) => {
    displayFullSurah(parseInt(e.target.value));
});

function toggleBookmark() {
    const currentSurah = parseInt(readingSurahSelect.value);
    const bookmarkData = {
        surah: currentSurah,
        timestamp: new Date().toLocaleString()
    };

    const existingIndex = bookmarks.findIndex(b => b.surah === currentSurah);
    
    if (existingIndex >= 0) {
        bookmarks.splice(existingIndex, 1);
        bookmarkBtn.classList.remove('bookmarked');
    } else {
        bookmarks.push(bookmarkData);
        bookmarkBtn.classList.add('bookmarked');
    }

    localStorage.setItem('quranBookmarks', JSON.stringify(bookmarks));
    updateBookmarksList();
}

function toggleAyahBookmark(surah, ayahNum) {
    const bookmarkId = `${surah}:${ayahNum}`;
    const bookmarkData = {
        id: bookmarkId,
        surah: surah,
        ayah: ayahNum,
        timestamp: new Date().toLocaleString()
    };

    const existingIndex = ayahBookmarks.findIndex(b => b.id === bookmarkId);
    
    if (existingIndex >= 0) {
        ayahBookmarks.splice(existingIndex, 1);
    } else {
        ayahBookmarks.push(bookmarkData);
    }

    localStorage.setItem('quranAyahBookmarks', JSON.stringify(ayahBookmarks));
    updateBookmarksList();
}

function toggleCurrentAyahBookmark() {
    if (!currentAyah) return;
    
    const isNowBookmarked = toggleAyahBookmark(currentAyah.surah.number, currentAyah.numberInSurah);
    const bookmarkBtn = document.querySelector('.ayah-bookmark-btn');
    
    bookmarkBtn.classList.toggle('bookmarked', isNowBookmarked);
    localStorage.setItem('quranAyahBookmarks', JSON.stringify(ayahBookmarks));
    updateBookmarksList();
}

function updateBookmarksList() {
    const surahBookmarksHtml = bookmarks
        .map(bookmark => {
            const surahName = quranData[bookmark.surah - 1].name;
            return `
                <div class="bookmark-item surah-bookmark">
                    <span onclick="goToBookmark(${bookmark.surah})">
                        ${surahName}
                    </span>
                    <span class="bookmark-date">${bookmark.timestamp}</span>
                    <button onclick="removeBookmark(${bookmark.surah})" class="remove-bookmark">×</button>
                </div>
            `;
        }).join('');

    const ayahBookmarksHtml = ayahBookmarks
        .map(bookmark => `
            <div class="bookmark-item ayah-bookmark">
                <span onclick="goToAyahBookmark('${bookmark.id}')">
                    ${bookmark.id}
                </span>
                <span class="bookmark-date">${bookmark.timestamp}</span>
                <button onclick="removeAyahBookmark('${bookmark.id}')" class="remove-bookmark">×</button>
            </div>
        `).join('');

    bookmarksList.innerHTML = `
        <h4>Surah Bookmarks</h4>
        ${surahBookmarksHtml}
        <h4>Ayah Bookmarks</h4>
        ${ayahBookmarksHtml}
    `;
}

function goToAyahBookmark(bookmarkId) {
    const [surahNum, ayahNum] = bookmarkId.split(':').map(Number);
    const surah = quranData[surahNum - 1];
    const ayah = surah.ayahs[ayahNum - 1];
    displayAyah(ayah);
}

function removeAyahBookmark(bookmarkId) {
    ayahBookmarks = ayahBookmarks.filter(b => b.id !== bookmarkId);
    localStorage.setItem('quranAyahBookmarks', JSON.stringify(ayahBookmarks));
    updateBookmarksList();
    
    if (currentAyah && `${currentAyah.surah.number}:${currentAyah.numberInSurah}` === bookmarkId) {
        const bookmarkBtn = document.querySelector('.ayah-bookmark-btn');
        if (bookmarkBtn) bookmarkBtn.classList.remove('bookmarked');
    }
}

function goToBookmark(surahNumber) {
    readingSurahSelect.value = surahNumber;
    displayFullSurah(surahNumber);
}

function removeBookmark(surahNumber) {
    bookmarks = bookmarks.filter(b => b.surah !== surahNumber);
    localStorage.setItem('quranBookmarks', JSON.stringify(bookmarks));
    updateBookmarksList();
    if (parseInt(readingSurahSelect.value) === surahNumber) {
        bookmarkBtn.classList.remove('bookmarked');
    }
}

function addToHistory(type, details) {
    const historyItem = {
        type,
        details,
        timestamp: new Date().toISOString()
    };
    
    readingHistory.unshift(historyItem); 
    if (readingHistory.length > 100) { 
        readingHistory.pop();
    }
    
    localStorage.setItem('quranReadingHistory', JSON.stringify(readingHistory));
    updateHistoryList();
}

function removeHistoryItem(event, index) {
    event.stopPropagation();
    readingHistory.splice(index, 1);
    localStorage.setItem('quranReadingHistory', JSON.stringify(readingHistory));
    updateHistoryList();
}

function updateHistoryList() {
    if (!historyDisplay.classList.contains('hidden')) {
        const clearBtn = `
            <button class="clear-history-btn" onclick="clearHistory()">
                Clear History
            </button>
        `;
        
        const historyHtml = readingHistory.map((item, index) => {
            const date = new Date(item.timestamp).toLocaleString();
            const surahName = quranData[item.details.surah - 1].name;
            let content = '';
            
            switch(item.type) {
                case 'ayah':
                    content = `Read Ayah ${item.details.surah}:${item.details.ayah}`;
                    break;
                case 'surah':
                    content = `Read Surah ${item.details.surah}`;
                    break;
                case 'test':
                    content = `Practiced Ayah ${item.details.surah}:${item.details.ayah} - ${item.details.correct === null ? 'Pending' : item.details.correct ? 'Correct' : 'Incorrect'}`;
                    break;
            }
            
            return `
                <div class="history-item" onclick="goToHistoryItem('${item.type}', ${JSON.stringify(item.details).replace(/"/g, '&quot;')})">
                    <div class="history-details">
                        <span>${surahName}</span>
                        <span>${content}</span>
                        <span class="history-timestamp">${date}</span>
                    </div>
                    <button class="remove-history" onclick="removeHistoryItem(event, ${index})">x</button>
                </div>
            `;
        }).join('');
        
        historyList.innerHTML = clearBtn + historyHtml;
    }
}

function clearMemorizationHistory() {
    readingHistory = readingHistory.filter(item => item.type !== 'test');
    localStorage.setItem('quranReadingHistory', JSON.stringify(readingHistory));
    updateMemorizationHistoryList();
}

function removeMemorizationHistoryItem(event, index) {
    event.stopPropagation();
    const memorizationHistory = readingHistory.filter(item => item.type === 'test');
    const itemToRemove = memorizationHistory[index];
    const itemIndex = readingHistory.indexOf(itemToRemove);
    readingHistory.splice(itemIndex, 1);
    localStorage.setItem('quranReadingHistory', JSON.stringify(readingHistory));
    updateMemorizationHistoryList();
}

function updateMemorizationHistoryList() {
    const historyHtml = readingHistory.filter(item => item.type === 'test').map((item, index) => {
        const date = new Date(item.timestamp).toLocaleString();
        let colorClass = '';
        if (item.details.correct === null) {
            colorClass = 'pending-answer';
        } else {
            colorClass = item.details.correct ? 'correct-answer' : 'incorrect-answer';
        }
        const surahName = quranData[item.details.surah - 1].name;
        const content = `Practiced Ayah ${item.details.surah}:${item.details.ayah} - ${item.details.correct === null ? 'Pending' : item.details.correct ? 'Correct' : 'Incorrect'}`;
        
        return `
            <div class="history-item ${colorClass}">
                <div class="history-details">
                    <span>${surahName}</span>
                    <span>${content}</span>
                    <span class="history-timestamp">${date}</span>
                </div>
                <button class="remove-history" onclick="removeMemorizationHistoryItem(event, ${index})">x</button>
            </div>
        `;
    }).join('');
    
    memorizationHistoryList.innerHTML = historyHtml;
}

function goToHistoryItem(type, details) {
    switch(type) {
        case 'ayah':
            const ayah = quranData[details.surah - 1].ayahs[details.ayah - 1];
            displayAyah(ayah);
            break;
        case 'surah':
            readingSurahSelect.value = details.surah;
            displayFullSurah(details.surah);
            break;
        case 'test':
            const testAyah = quranData[details.surah - 1].ayahs[details.ayah - 1];
            displayAyah(testAyah);
            break;
    }
}

function clearHistory() {
    readingHistory = [];
    localStorage.setItem('quranReadingHistory', JSON.stringify(readingHistory));
    updateHistoryList();
}

bookmarkBtn.removeEventListener('click', toggleBookmark);
bookmarkBtn.addEventListener('click', () => {
    bookmarksList.parentElement.classList.toggle('hidden');
});

function toggleAbout() {
    const aboutSection = document.getElementById('about-section');
    const isHidden = aboutSection.classList.contains('hidden');
    
    if (isHidden) {
        const overlay = document.createElement('div');
        overlay.className = 'about-overlay';
        overlay.onclick = toggleAbout;
        document.body.appendChild(overlay);
    } else {
        const overlay = document.querySelector('.about-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    aboutSection.classList.toggle('hidden');
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('light-mode');
    
    const themeButton = document.querySelector('[title="Toggle Theme"]');
    themeButton.textContent = isDarkMode ? '☾' : '☀';
    
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', () => {
    updateBookmarksList();
    updateHistoryList();
    const clearMemBtn = document.getElementById('clear-memorization-history');
    if (clearMemBtn) {
        clearMemBtn.addEventListener('click', clearMemorizationHistory);
    }
    const pencilButton = document.getElementById('pencil-button');
    const editorControls = document.getElementById('editor-controls');
    const singleSurahButton = document.getElementById('single-mode');
    const advancedModeButton = document.getElementById('multiple-mode');
    const readQuranButton = document.getElementById('reading-mode');
    const historyButton = document.getElementById('history-mode');
    const memorizationHistoryButton = document.getElementById('memorization-history-btn');
    const moodModeButton = document.getElementById('mood-mode');
    let isEditorMode = false;

    pencilButton.addEventListener('click', () => {
        isEditorMode = !isEditorMode;
        document.body.classList.toggle('editor-mode', isEditorMode);
        editorControls.classList.toggle('hidden', !isEditorMode);

        const controlsCard = document.querySelector('.card.controls');
        controlsCard.classList.toggle('hidden', isEditorMode);

        if (isEditorMode) {
            
            ayahDisplay.classList.add('hidden');
            answerDisplay.classList.add('hidden');
            readingDisplay.classList.add('hidden');
            historyDisplay.classList.add('hidden');
            memorizationHistoryDisplay.classList.add('hidden');
            singleControls.classList.add('hidden');
            multiControls.classList.add('hidden');

            
            singleSurahButton.classList.remove('active');
            advancedModeButton.classList.remove('active');
            readQuranButton.classList.remove('active');
            historyButton.classList.remove('active');
            memorizationHistoryButton.classList.remove('active');

           
            pickAyahButton.classList.add('hidden');
        }
    });

    document.getElementById('toggle-single-surah').addEventListener('click', (e) => {
        singleSurahButton.classList.toggle('hidden');
        e.target.classList.toggle('active');
    });

    document.getElementById('toggle-advanced-mode').addEventListener('click', (e) => {
        advancedModeButton.classList.toggle('hidden');
        e.target.classList.toggle('active');
    });

    document.getElementById('toggle-read-quran').addEventListener('click', (e) => {
        readQuranButton.classList.toggle('hidden');
        e.target.classList.toggle('active');
    });

    document.getElementById('toggle-history').addEventListener('click', (e) => {
        historyButton.classList.toggle('hidden');
        e.target.classList.toggle('active');
    });

    document.getElementById('toggle-memorization-history').addEventListener('click', (e) => {
        memorizationHistoryButton.classList.toggle('hidden');
        e.target.classList.toggle('active');
    });

    document.getElementById('toggle-mood').addEventListener('click', (e) => {
        moodModeButton.classList.toggle('hidden');
        e.target.classList.toggle('active');
    });

    const listeningButton = document.getElementById('listening-mode');

    document.getElementById('toggle-listening').addEventListener('click', (e) => {
        listeningButton.classList.toggle('hidden');
        e.target.classList.toggle('active');
    });

    const toggleListeningBtn = document.getElementById('toggle-listening');
    toggleListeningBtn.addEventListener('click', () => {
        if (listeningModeBtn.classList.contains('hidden')) {
            listeningModeBtn.classList.remove('hidden');
            toggleListeningBtn.classList.add('active');
        } else {
            listeningModeBtn.classList.add('hidden');
            toggleListeningBtn.classList.remove('active');
        }
    });

    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        isDarkMode = true; 
        toggleTheme();
    }
    
    window.toggleTheme = toggleTheme;

    window.toggleAbout = toggleAbout;
});

const moodAyahs = {
    happy: [
        { surah: 93, ayah: 5 }, // "And your Lord is going to give you, and you will be satisfied"
        { surah: 94, ayah: 5 }, // "For indeed, with hardship [will be] ease"
        { surah: 94, ayah: 6 }  // "Indeed, with hardship [will be] ease"
    ],
    sad: [
        { surah: 2, ayah: 286 }, // "Allah does not charge a soul except [with that within] its capacity"
        { surah: 94, ayah: 5 },  // "For indeed, with hardship [will be] ease"
        { surah: 2, ayah: 153 }  // "O you who have believed, seek help through patience and prayer"
    ],
    anxious: [
        { surah: 13, ayah: 28 }, // "Those who have believed and whose hearts are assured by the remembrance of Allah"
        { surah: 2, ayah: 155 }, // "And We will surely test you with something of fear and hunger"
        { surah: 3, ayah: 139 }  // "So do not weaken and do not grieve, and you will be superior"
    ],
    grateful: [
        { surah: 14, ayah: 7 },  // "If you are grateful, I will surely increase you [in favor]"
        { surah: 55, ayah: 13 }, // "So which of the favors of your Lord would you deny?"
        { surah: 93, ayah: 11 }  // "And as for the favor of your Lord, report [it]"
    ],
    hopeful: [
        { surah: 65, ayah: 7 },  // "Allah will bring about, after hardship, ease"
        { surah: 2, ayah: 216 }, // "But perhaps you hate a thing and it is good for you"
        { surah: 94, ayah: 5 }   // "For indeed, with hardship [will be] ease"
    ]
};


document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
        
        btn.classList.add('active');
        
        const mood = btn.dataset.mood;
        const moodAyahsList = moodAyahs[mood];
        const randomAyah = moodAyahsList[Math.floor(Math.random() * moodAyahsList.length)];
        
        const ayah = quranData[randomAyah.surah - 1].ayahs[randomAyah.ayah - 1];
        displayMoodAyah(ayah, randomAyah.surah, randomAyah.ayah);
    });
});

function displayMoodAyah(ayah, surahNumber, ayahNumber) {
    const moodAyahDisplay = document.getElementById('mood-ayah-display');
    const moodAyahNumberElement = document.getElementById('mood-ayah-number');
    const moodAyahTextElement = document.getElementById('mood-ayah-text');

    moodAyahNumberElement.textContent = `${surahNumber}:${ayahNumber}`;
    moodAyahTextElement.textContent = ayah.text;
    moodAyahDisplay.classList.remove('hidden');
}

async function fetchReciters() {
    try {
        // Using static list of popular reciters from mp3quran.net
        const reciters = [
            { id: "mishari_rashid_alafasy", reciter_name: "Mishary Rashid Alafasy" },
            { id: "abdul_basit_murattal", reciter_name: "Abdul Basit Abdul Samad" },
            { id: "abu_bakr_ash_shaatree", reciter_name: "Abu Bakr Al Shatri" },
            { id: "maher_al_muaiqly", reciter_name: "Maher Al Muaiqly" },
            { id: "mohammad_al_tablaway", reciter_name: "Mohammad al Tablaway" },
            { id: "saud_al_shuraim", reciter_name: "Saud Al-Shuraim" },
        ];
        return reciters;
    } catch (error) {
        console.error('Error with reciters:', error);
        return [];
    }
}

function populateReciters(reciters) {
    // Add a default option
    const defaultOption = '<option value="">Select a reciter</option>';
    const reciterOptions = reciters.map(reciter => 
        `<option value="${reciter.id}">${reciter.reciter_name}</option>`
    ).join('');
    
    reciterSelect.innerHTML = defaultOption + reciterOptions;
    // Don't set a default reciter - let user choose
    currentReciter = null;
}

async function loadAudioForAyah(surahNumber, ayahNumber) {
    try {
        if (!currentReciter) return;
        
        // Format numbers to have leading zeros
        const formattedSurah = String(surahNumber).padStart(3, '0');
        const formattedAyah = String(ayahNumber).padStart(3, '0');
        
        // Using mp3quran.net API
        const audioUrl = `https://server8.mp3quran.net/${currentReciter}/${formattedSurah}${formattedAyah}.mp3`;
        
        quranAudio.src = audioUrl;
        quranAudio.load();
        
        currentAudioAyah = { surah: surahNumber, ayah: ayahNumber };
        
        try {
            await quranAudio.play();
        } catch (playError) {
            if (playError.name !== 'AbortError') {
                console.error('Playback failed:', playError);
            }
        }
    } catch (error) {
        console.error('Error loading audio:', error);
    }
}

function updateAyahSelect(surahNumber) {
    const surah = quranData[surahNumber - 1];
    ayahSelect.innerHTML = surah.ayahs.map((_, index) =>
        `<option value="${index + 1}">Ayah ${index + 1}</option>`
    ).join('');
}

reciterSelect.addEventListener('change', (e) => {
    currentReciter = e.target.value;
    if (currentAudioAyah) {
        loadAudioForAyah(currentAudioAyah.surah, currentAudioAyah.ayah);
    }
});

listeningsurahSelect.addEventListener('change', (e) => {
    const surahNumber = parseInt(e.target.value);
    updateAyahSelect(surahNumber);
});

ayahSelect.addEventListener('change', (e) => {
    const surahNumber = parseInt(listeningsurahSelect.value);
    const ayahNumber = parseInt(e.target.value);
    loadAudioForAyah(surahNumber, ayahNumber);
});

prevAyahBtn.addEventListener('click', () => {
    if (currentAudioAyah) {
        const prevAyah = currentAudioAyah.ayah - 1;
        if (prevAyah > 0) {
            ayahSelect.value = prevAyah;
            loadAudioForAyah(currentAudioAyah.surah, prevAyah);
        }
    }
});

nextAyahBtn.addEventListener('click', () => {
    if (currentAudioAyah) {
        const surah = quranData[currentAudioAyah.surah - 1];
        const nextAyah = currentAudioAyah.ayah + 1;
        if (nextAyah <= surah.ayahs.length) {
            ayahSelect.value = nextAyah;
            loadAudioForAyah(currentAudioAyah.surah, nextAyah);
        }
    }
});

quranAudio.addEventListener('ended', () => {
    nextAyahBtn.click();
});

fetchQuranData();
