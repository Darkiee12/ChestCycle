Math.modulo = function (a, b) {
  return ((a % b) + b) % b;
}
class ChestManager {
  canvas = document.getElementById('canvas');
  chests = {
    common: {
      url: "https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoic3VwZXJjZWxsXC9maWxlXC85ZzVyYWFjRmF0enNTN1lyYjY3TS5wbmcifQ:supercell:aAuoUY7qG_v6CYsZvtkUFTN-nh7A5lcssJ5GlOcGiB4?width=2400",
      name: "Common",
      color: "bg-[#8A4B26]"
    },
    rare: {
      url: "https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoic3VwZXJjZWxsXC9maWxlXC9Rek1RbnN3cE5yOHJyUkV6THpwdi5wbmcifQ:supercell:z_WrRoRiaLlPfbckhNDABaoUyfumEg5r7J8iROfB0Vk?width=2400",
      name: "Rare",
      color: "bg-[#F0A900]"
    },
    epic: {
      url: "https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoic3VwZXJjZWxsXC9maWxlXC8zbkFTSzZ6ZDN0c0ptUWt2WkFucS5wbmcifQ:supercell:t_ikZ6r43u3zCk5eGGIleUfs04JCK8vhId2W2-rG8pA?width=2400",
      name: "Epic",
      color: "bg-[#8544C3]"
    }
  };

  cycle = ["common", "rare", "common", "epic", "common", "common", "rare", "common", "rare", "rare",
           "rare", "common", "rare", "common", "common", "epic", "common", "common", "common", "common",
           "common", "common", "common", "rare", "common", "rare", "common", "common", "rare", "rare",
           "rare", "common", "common", "epic", "common", "epic", "common", "common", "common", "common",
           "common", "common", "common", "rare", "common", "rare", "common", "common", "common", "rare",
           "rare", "epic", "common", "rare", "common", "common", "common", "common", "epic", "common"
  ];
  constructor() {
    this.selectedChest = null;
    this.observers = [];
  }

  selectChest(chest) {
    if (this.selectedChest) {
      this.selectedChest.classList.remove('selected');
    }
    this.selectedChest = chest;
    if (this.selectedChest) {
      this.selectedChest.classList.add('selected');
    }
    this.notifyObservers();
    this.persistState();
    this.updateNextChest();
  }

  registerObserver(observer) {
    this.observers.push(observer);
  }

  notifyObservers() {
    this.observers.forEach(observer => observer.update(this.selectedChest));
  }

  persistState() {
    const index = Array.from(document.querySelectorAll('.chest')).indexOf(this.selectedChest);
    localStorage.setItem("CurrentChest", index);
  }

  getCurrentState() {
    return parseInt(localStorage.getItem("CurrentChest"));
  }

  updateNextChest() {
    const index = this.getCurrentState();
    let nextIndex;
    let row = Math.floor(index / 10);
    if (row % 2 === 0) {
      nextIndex = (index % 10 == 9) ? index + 10 : index + 1;
    } else {
      nextIndex = (index % 10 == 0) ? index + 10 : index - 1;
    }
    const nextChest = document.getElementById('next-chest');
    const img = document.createElement('img');
    img.classList.add("w-24", "p-2");
    img.src = this.chests[this.cycle[nextIndex % this.cycle.length]].url;
    img.alt = this.chests[this.cycle[nextIndex % this.cycle.length]].name;
    nextChest.innerHTML = "";
    nextChest.appendChild(img);
  }

  loadState() {
    const index = parseInt(localStorage.getItem("CurrentChest")) || 0;
    this.canvas.innerHTML = "";
    this.cycle.forEach((rarity, index) => {
      const chest = new Chest(index, this.chests[rarity]).render();
      this.canvas.appendChild(chest);
    });
    if (index !== null) {
      const chests = document.querySelectorAll('.chest');
      const chest = chests[index];
      if (chest) {
        this.selectChest(chest);
      }
    }
  }
}

class ChestObserver {
  update(selectedChest) {
    console.log(`Selected chest:`, selectedChest);
  }
}

class Chest {
  constructor(index, chest) {
    this.index = index;
    this.chest = chest;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.classList.add("relative", "flex", "justify-center", "items-center", "col-span-1");
    const container = document.createElement('div');
    container.classList.add("chest", "flex", "md:h-10", "h-6");
    container.id = this.index;
    const img = document.createElement('img');
    img.src = this.chest.url;
    img.alt = this.chest.name;
    container.appendChild(img);
    container.addEventListener('click', () => {
      manager.selectChest(container);
    });
    wrapper.appendChild(container);
    return wrapper;
  }
}

const manager = new ChestManager();
const observer = new ChestObserver();
manager.registerObserver(observer);
manager.loadState();
const DELAY = 500;
function moveRight() {
  const button = document.getElementById('right');
  button.classList.add('translate-x-5'); 
  setTimeout(() => {
    button.classList.remove('translate-x-5');
  }, DELAY); 
  const chests = Array.from(document.querySelectorAll('.chest'));
  const currentChest = manager.selectedChest;
  const index = parseInt(currentChest.id);
  let nextIndex;
  let row = Math.floor(index / 10);
  if (row % 2 === 0) {
    nextIndex = (index % 10 == 9) ? index + 10 : index + 1;
  } else {
    nextIndex = (index % 10 == 0) ? index + 10 : index - 1;
  }
  manager.selectChest(chests[nextIndex % manager.cycle.length]);
}

function moveLeft() {
  const button = document.getElementById('left');
  button.classList.add('-translate-x-5'); 
  setTimeout(() => {
    button.classList.remove('-translate-x-5');
  }, DELAY); 
  const chests = Array.from(document.querySelectorAll('.chest'));
  const currentChest = manager.selectedChest;
  const index = parseInt(currentChest.id);
  let prevIndex;
  let row = Math.floor(index / 10);
  if (row % 2 === 0) {
    prevIndex = (index % 10 == 0) ? index - 10 : index - 1;
  } else {
    prevIndex = (index % 10 == 9) ? index - 10 : index + 1;
  }
  manager.selectChest(chests[Math.modulo(prevIndex, manager.cycle.length)]);
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowLeft') {
      moveLeft();
  } else if (event.key === 'ArrowRight') {
      moveRight();
  }
});

function moveLeftThrice(){
  for(let i = 0; i < 3; i++){
    moveLeft();
  }
}

function moveRightThrice(){
  for(let i = 0; i < 3; i++){
    moveRight();
  }
}