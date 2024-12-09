const wlanInfo = {
    "wlanName": "Keepcalmspb",
    "wlanName5G": "Keepcalmspb_5G",
    "wlanPassword": "len12345"
};

const buttonsList = {
    "time": document.querySelector('#time-button'),
    "fix": document.querySelector('#fix-button'),
    "wlan": document.querySelector('#wlan-button'),
    "wlanHeader": document.querySelector('#wlan-button__header'),
    "back": document.querySelector('#back-button'),
    "backWlan": document.querySelector('#back-button-wlan'),
    "copyPassword": document.querySelector('#copy-password'),
}
const screensList = {
    "main": document.querySelector('#main-screen'),
    "menu": document.querySelector('#menu-screen'),
    "wlan": document.querySelector('#wlan-screen'),
}
const labels = {
    "screenName": document.querySelector('#page-info > h2'),
    "descText": document.querySelector('#page-info > p'),
}
buttonsList["back"].addEventListener('click', () => {
    Object.values(screensList).forEach(screen => {
        screen.removeAttribute('style');
    });
    screensList["main"].classList.remove('blur');
})
buttonsList["backWlan"].addEventListener('click', () => {
    screensList["wlan"].removeAttribute('style');
    if(!screensList["menu"].classList.contains('blur')) {
        screensList["main"].classList.remove('blur');
    }
    screensList["menu"].classList.remove('blur');
})
buttonsList["time"].addEventListener('click', () => {
    screensList["main"].classList.add('blur');
    screensList["menu"].style.left = '0';
    loadTime();
})
buttonsList["fix"].addEventListener('click', () => {
    screensList["main"].classList.add('blur');
    screensList["menu"].style.left = '0';
    loadFix();
})
buttonsList["wlan"].addEventListener('click', () => {
    screensList["main"].classList.add('blur');
    screensList["wlan"].style.left = '0';
})
buttonsList["wlanHeader"].addEventListener('click', () => {
    screensList["menu"].classList.add('blur');
    screensList["wlan"].style.left = '0';
})
buttonsList["copyPassword"].addEventListener('click', () => {
    navigator.clipboard.writeText(wlanInfo["wlanPassword"]);
})

const categoryNames = {
    "non_alcohol": "Безалкогольное",
    "alcohol": "Алкогольное",
    "hookahs": "Кальяны",
    "food": "Перекус",
    "special": "Дополнительно"
};
const data = {
    "prices": "./data/prices.json",
    "texts": "./data/texts.json",
};

class DataLoader {
    static generalItems;
    static timeItems;
    static fixItems;

    static timeText;
    static fixText;

    static async loadData() {
        try {
            const response = await fetch(data.prices);
            const parsedData = await response.json();

            DataLoader.generalItems = parsedData.general_items || {};
            DataLoader.timeItems = parsedData.time_items || {};
            DataLoader.fixItems = parsedData.fix_items || {};
        } catch (error) {
            console.error('Ошибка при загрузке данных меню:', error);
            DataLoader.generalItems = {};
            DataLoader.timeItems = {};
            DataLoader.fixItems = {};
        }
    }

    static async loadDisc() {
        try {
            const response = await fetch(data.texts);
            const parsedData = await response.json();

            DataLoader.fixText = parsedData.fix || ' ';
            DataLoader.timeText = parsedData.time || ' ';
        } catch (error) {
            console.error('Ошибка при загрузке данных описаний:', error);
        }
    }

    static clearData() {
        DataLoader.generalItems = {};
        DataLoader.timeItems = {};
        DataLoader.fixItems = {};
    }
}

class MenuGenerator {
    static container;

    static initialize(containerSelector) {
        MenuGenerator.container = document.querySelector(containerSelector);
    }

    static setText(text) {
        const textNode = document.querySelector('#page-ingo__text');
        textNode.innerText = text;
    }

    static generateCategory(title, items) {
        if (!items || items.length === 0) return;

        const categoryTitle = document.createElement('h2');
        categoryTitle.innerText = categoryNames[title];

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category', 'rounder');

        items.forEach(item => {
            const listElement = MenuGenerator.createListElement(item);
            categoryContainer.appendChild(listElement);
        });

        MenuGenerator.container.appendChild(categoryTitle);
        MenuGenerator.container.appendChild(categoryContainer);
    }

    static createListElement(item) {
        const listElement = document.createElement('div');
        listElement.classList.add('list-element');

        if (item.popular) {
            listElement.classList.add('popular');
        };

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('list-element__content');

        const label = document.createElement('p');
        label.classList.add('list-element__label');
        label.innerText= item.name;

        const discDiv = document.createElement('div');
        discDiv.classList.add('list-element__disc');
        item.additionals.forEach(additional => {
            const p = document.createElement('p');
            p.innerText= additional;
            discDiv.appendChild(p);
        });

        contentDiv.appendChild(label);
        contentDiv.appendChild(discDiv);
        
        listElement.appendChild(contentDiv);
        
        const price = document.createElement('p');
        price.classList.add('list-element__price');
        price.innerText = item.price || "free";

        listElement.appendChild(price);

        return listElement;
    }

    static generateMenu(data) {
        if (!data || Object.keys(data).length === 0) {
            console.warn('Нет данных для генерации меню.');
            return;
        }

        Object.keys(data).forEach(category => {
            const categoryItems = data[category];
            MenuGenerator.generateCategory(category, categoryItems);
        });
    }

    static clearMenu() {
        if (MenuGenerator.container) {
            MenuGenerator.container.innerHTML = '';
        }
    }
}

const loadFix = async () => {
    labels["screenName"].innerText = 'Фикс';
    MenuGenerator.initialize('.list-container');
    MenuGenerator.clearMenu();
    
    await DataLoader.loadData();
    await DataLoader.loadDisc();

    MenuGenerator.setText(DataLoader.fixText)
    
    if (DataLoader.fixItems) {
        MenuGenerator.generateMenu(DataLoader.fixItems);
        MenuGenerator.generateMenu(DataLoader.generalItems);
    } else {
        console.warn('fixItems не был загружен.');
    }
}
const loadTime = async () => {
    labels["screenName"].innerText = 'Тайм';
    MenuGenerator.initialize('.list-container');
    MenuGenerator.clearMenu();
    
    await DataLoader.loadData();
    await DataLoader.loadDisc();

    MenuGenerator.setText(DataLoader.timeText)
    
    if (DataLoader.timeItems) {
        MenuGenerator.generateMenu(DataLoader.timeItems);
        MenuGenerator.generateMenu(DataLoader.generalItems);
    } else {
        console.warn('timeItems не был загружен.');
    }
}
const setupWlanVisiblies = () => {
    const wlanNameNode = document.querySelector('#wlan-name > p');
    const wlanName5GNode = document.querySelector('#wlan-name-5g > p');
    const wlanPasswordNode = document.querySelector('#wlan-password');
    const copyPasswordButton = document.querySelector('#copy-password');

    wlanNameNode.innerText = wlanInfo["wlanName"];
    wlanName5GNode.innerText = wlanInfo["wlanName5G"];
    wlanPasswordNode.innerText = wlanInfo["wlanPassword"];

    copyPasswordButton.addEventListener('click', () => {
        wlanPasswordNode.innerText = 'Пароль скопирован';

        setTimeout(() => {
            wlanPasswordNode.innerText = wlanInfo["wlanPassword"];
        }, 5000)
    })
}
setupWlanVisiblies();
