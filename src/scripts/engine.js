
const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points')
    },
    cardSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type')
    },
    fieldCard:{
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card')
    },
    actions:{
        buttom: document.getElementById('next-duel')
    },
    playerSides:{
        player: 'player-cards',
        playerBox: document.querySelector('#player-cards'),
        computer: 'computer-cards',
        computerBox: document.querySelector('#computer-cards')
    }
};



const pathImage = './src/assets/icons/'

const cardData = [
    {
        id:0,
        name: 'Blue Eyes White Dragon',
        type: 'Paper',
        img: `${pathImage}dragon.png`,
        WinOf: [1],
        LoseOf: [2]
    },
    {
        id:1,
        name: 'Dark Magician',
        type: 'Rock',
        img: `${pathImage}magician.png`,
        WinOf: [2],
        LoseOf: [0]
    },
    {
        id:2,
        name: 'Exodia',
        type: 'Scissors',
        img: `${pathImage}exodia.png`,
        WinOf: [0],
        LoseOf: [1]
    }
]

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(Idcard, fieldSide)
{
    const cardImage = document.createElement('img');
    cardImage.setAttribute('height', '100px');
    cardImage.setAttribute('src', './src/assets/icons/card-back.png');
    cardImage.setAttribute('data-id', Idcard);
    cardImage.classList.add('card');

    if(fieldSide === state.playerSides.player){

        cardImage.addEventListener('mouseover', () => {
            drawSelectCard(Idcard);
        })

        cardImage.addEventListener('click', () => {
            setCardsField(cardImage.getAttribute(('data-id')));
        });
    }

    return cardImage;
}

async function hiddenCardDetails(){
    state.cardSprites.avatar.src = '';
    state.cardSprites.name.innerText = '';
    state.cardSprites.type.innerText = '';

}

async function ShowHiddenCardFieldsImages(value){
    if(value === true){
        state.fieldCard.player.style.display = 'block';
        state.fieldCard.computer.style.display = 'block';    
    }
    if(value === false){
        state.fieldCard.player.style.display = 'none';
        state.fieldCard.computer.style.display = 'none';    
    }
}

async function setCardsField(cardId){
    await removeAllCardsImage();

    let computerCardId = await getRandomCardId();

    await hiddenCardDetails();

    state.fieldCard.player.src = cardData[cardId].img;
    state.fieldCard.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await ShowHiddenCardFieldsImages(true)

    await updateScore();

    await drawButton(duelResults);
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawButton(text){
    state.actions.buttom.innerText = `YOU ${text.toUpperCase()}`;
    state.actions.buttom.style.display = 'block';
}

async function checkDuelResults(playeCardId, computerCardId){
    let duelResults = 'Empatou';
    let playeCard = cardData[playeCardId];

    if(playeCard.WinOf.includes(computerCardId)){
        duelResults = 'win';
        state.score.playerScore++;
    }
    if(playeCard.LoseOf.includes(computerCardId)){
        duelResults = 'lose';
        state.score.computerScore++;
    }
    await playAudio(duelResults);

    return duelResults;
}

async function removeAllCardsImage(){
    let {computerBox, playerBox} = state.playerSides;
    let imgElements = computerBox.querySelectorAll('img');
    imgElements.forEach((img) => img.remove());

    imgElements = playerBox.querySelectorAll('img');
    imgElements.forEach((img) => img.remove());
    
}

async function drawSelectCard(index)
{
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = 'Attibute: ' + cardData[index].type;
}
async function drawCards(cardNumers, fieldSide){
    for (let i = 0; i < cardNumers; i++) {
        
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);

    }
}

function resetDuel(){
    state.cardSprites.avatar.src = '';
    state.actions.buttom.style.display = 'none';
    state.fieldCard.player.style.display = 'none';
    state.fieldCard.computer.style.display = 'none';
    
    init();
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    try {
        audio.play()    
    } catch (error) {
        
    }
} 

async function init(){
    await ShowHiddenCardFieldsImages(false);
    
    await drawCards(5, state.playerSides.player);
    await drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById('bgm');
    bgm.play();
}

init();