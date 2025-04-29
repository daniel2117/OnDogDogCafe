const mongoose = require('mongoose');
const Dog = require('../models/Dog');
const config = require('../config/config');

// --- Data Provided by User ---
const specificDogData = [
  { breed: 'Labrador Retriever', color: 'White', images: ['https://labradorwise.com/wp-content/uploads/2021/06/white-labrador-retriever.jpg', 'https://www.snowypineswhitelabs.com/wp-content/uploads/2019/10/Crystal_3-1.jpg', 'https://www.snowypineswhitelabs.com/wp-content/uploads/2024/05/2D8A2024-scaled.jpg', 'https://i.pinimg.com/736x/31/3f/0d/313f0dc4f528581772552960a7160a02.jpg'] },
  { breed: 'Labrador Retriever', color: 'Yellow', images: ['https://www.dogster.com/wp-content/uploads/2024/03/smiling-yellow-labrador-dog-at-the-park_sanjagrujic_Shutterstock.jpg', 'https://cdn.greenfieldpuppies.com/wp-content/uploads/2016/07/Yellow-Labrador-Retriever-e1532451721984.jpg', 'https://www.pdinsurance.co.nz/wp-content/uploads/2021/03/Labrador-Personality-and-Profile-1-1024x768.jpg', 'https://www.dogster.com/wp-content/uploads/2024/04/labrador-retriever-dog-standing-in-the-grass_Alexander-Rim_Shutterstock.jpg'] },
  { breed: 'French Bulldog', color: 'Black', images: ['https://www.dogster.com/wp-content/uploads/2024/03/a-black-french-bulldog-standing-on-grass_Tanya-Consaul-Photography_Shutterstock.jpg', 'https://dogster.com/wp-content/uploads/2024/03/Black-french-bulldog-lying-on-the-floor-%EC%A4%80%EC%84%AD-%EC%9C%A4-Pexels.jpg', 'https://tomkingskennel.com/wp-content/uploads/2020/04/black1.jpg', 'https://static.themarthablog.com/2024/04/PXL_20240418_201921864.PORTRAIT-scaled.jpg'] },
  { breed: 'Pembroke Welsh Corgi', color: 'Red & White', images: ['https://www.akc.org/wp-content/uploads/2017/11/Pembroke-Welsh-Corgi-standing-outdoors-in-the-fall.jpg', 'https://upload.wikimedia.org/wikipedia/commons/9/99/Welsh_Pembroke_Corgi.jpg', 'https://as2.ftcdn.net/v2/jpg/02/13/20/03/500_F_213200366_CEHLufIVW8hMjngNUfkRjxZpeiCzkB5m.jpg', 'https://www.purina.in/sites/default/files/2021-02/BREED%20Hero_0137_welsh_corgi_pembroke.jpg'] },
  { breed: 'Cardigan Welsh Corgi', color: 'Blue Merle', images: ['https://image.petmd.com/files/styles/863x625/public/2023-10/cardigan-welsh-corgi.jpg', 'https://www.dogsnsw.org.au/media/img/BrowseAllBreed/Welsh-Corgi-Cardigan.jpg', 'https://www.dogster.com/wp-content/uploads/2023/07/Cardigan-Welsh-Corgi-in-Road_Serova_Ekaterina_Shutterstock.jpg', 'https://www.betterbred.com/wp-content/uploads/2021/12/CWC1-scaled.jpeg'] },
  { breed: 'Labrador Retriever', color: 'Black', images: ['https://images.pexels.com/photos/15971943/pexels-photo-15971943/free-photo-of-black-labrador-retriever.jpeg', 'https://www.shutterstock.com/image-photo/closeup-happy-panting-black-labrador-600nw-2392418725.jpg', 'https://t3.ftcdn.net/jpg/04/54/55/12/360_F_454551275_Acvw6jQyxtCFTueczHci7xywAMzOQbXN.jpg', 'https://www.shutterstock.com/image-photo/black-labrador-retriever-lying-down-600nw-2193480373.jpg'] },
  { breed: 'Golden Retriever', color: 'Golden', images: ['https://images.squarespace-cdn.com/content/v1/5f7c95be04dda05edcc091c3/1718071911646-J881YR70Y91SNAA4O129/Sandy+Ruger+x+Ginger+2022.jpeg', 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Canadian_Golden_Retriever.jpeg', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/A_Golden_Retriever-9_(Barras).JPG/1280px-A_Golden_Retriever-9_(Barras).JPG', 'https://www.thesprucepets.com/thmb/F-6m45bLy1Ecu2p-egqup7BPVzI=/2124x0/filters:no_upscale():strip_icc()/GoldenPuppy185743593-56a9c1f23df78cf772aa4a33.jpg'] },
  { breed: 'Labrador Retriever', color: 'Chocolate', images: ['https://t4.ftcdn.net/jpg/04/24/95/37/360_F_424953777_dPR9ZIdKn1PnlWP2BV7vhWabrpN2kTRE.jpg', 'https://static.wixstatic.com/media/b41754_54963b12aa314cfd9174fdeefd875f63~mv2.jpg/v1/fill/w_640,h_592,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/b41754_54963b12aa314cfd9174fdeefd875f63~mv2.jpg', 'https://www.hepper.com/wp-content/uploads/2022/08/chocolate-labrador-retriver-sitting-on-grass_Zontica_Shutterstock.jpg', 'https://www.thelabradorsite.com/wp-content/uploads/2015/07/buying-a-chocolate-labrador-puppy.jpg'] },
  { breed: 'Pomeranian', color: 'White', images: ['https://static.wixstatic.com/media/aae8ad_3f145d8656ea447781996730488042f9~mv2.jpeg/v1/fill/w_280,h_316,q_90,enc_avif,quality_auto/aae8ad_3f145d8656ea447781996730488042f9~mv2.jpeg', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/White_Pomeranian.jpg/2560px-White_Pomeranian.jpg', 'https://dogster.com/wp-content/uploads/2024/03/white-pomeranian-on-a-bench_ana_olly-Pixabay.webp', 'https://i.pinimg.com/originals/24/ff/29/24ff298e8fbd4c5c223a091169c0aa84.jpg'] },
  { breed: 'German Shepherd', color: 'Tan and Black', images: ['https://www.mittelwest.com/wp-content/uploads/2025/03/mittelwest-trained-female-german-shpherd-kayla-vom-mittelwest.jpg', 'https://previews.123rf.com/images/jewhyte/jewhyte1007/jewhyte100700001/7403937-black-and-tan-german-shepherd-dog.jpg', 'https://i.pinimg.com/736x/b5/29/1a/b5291ad91ac2ca5a35efcbfd42b88649.jpg', 'https://images.squarespace-cdn.com/content/v1/5fff973ae3ceda1c1a855cb9/1686505929185-PNXNPCXC9POBI5I4N4NH/IMG_2822.jpg'] },
  { breed: 'Australian Shepherd', color: 'Blue Merle', images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Miniature_Australian_Shepherd_blue_merle.jpg/1024px-Miniature_Australian_Shepherd_blue_merle.jpg', 'https://www.bubblypet.com/wp-content/uploads/2020/12/Blue-merle-Australian-Shepherd-with-green-grass-and-tonga.jpg', 'https://t3.ftcdn.net/jpg/07/81/24/00/360_F_781240019_42QHTcR4ACuWr2Cn5rxamvO9Z6z6Xcdz.jpg', 'https://www.akc.org/wp-content/uploads/2021/07/Australian-Shepherd-puppy-3-months-old-laying-down-in-the-shade-with-a-toy-400x267.jpeg'] },
  { breed: 'Shiba Inu', color: 'Red', images: ['https://img.freepik.com/premium-photo/red-shiba-inu-puppy-dog-standing-outdoor_357532-113.jpg', 'https://www.dogster.com/wp-content/uploads/2024/03/female-shiba-inu-standing-on-the-floor-inside-the-apartment_Sergiy-Palamarchuk_Shutterstock.jpg', 'https://thumb.photo-ac.com/84/848e866af7118f46fc1d94edbf8d2704_t.jpeg', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/A_Shiba_Inu.jpg/1200px-A_Shiba_Inu.jpg'] },
  { breed: 'French Bulldog', color: 'Cream', images: ['https://upload.wikimedia.org/wikipedia/commons/b/b7/French_Bulldog_cream_standing.jpg', 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Cream_French_Bulldog.jpg', 'https://www.shutterstock.com/image-photo/sleeping-cream-french-bulldog-puppy-600nw-1976050316.jpg', 'https://petskb.com/wp-content/uploads/2019/08/cream-and-white.jpg'] },
  { breed: 'Pug', color: 'Fawn', images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/6-month-old_fawn_pug_2009_England.jpg/525px-6-month-old_fawn_pug_2009_England.jpg', 'https://i.pinimg.com/474x/e6/86/43/e6864352c467fec3713627c7b517551b.jpg', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Fawn_pug_2.5year-old.JPG/1200px-Fawn_pug_2.5year-old.JPG', 'https://t3.ftcdn.net/jpg/13/55/99/68/360_F_1355996816_zP6OSA8Y0PrPdvwUtOlG1Ex8IJMqT6Iv.jpg'] },
  { breed: 'Siberian Husky', color: 'Silver', images: ['https://images.squarespace-cdn.com/content/v1/562a694ae4b01720bea9fe9d/1513754311086-5SPNKXG8SSA0M4OFZEGR/17634625_10154332668617155_4592384314064901382_n.jpg', 'https://c8.alamy.com/zooms/9/820d5d80002c4625a9feef450f57b504/kppk1y.jpg', 'https://i.pinimg.com/564x/b8/45/2c/b8452c6c4a40e5666832815d4f2aa741.jpg', 'https://i.pinimg.com/736x/a2/ec/72/a2ec72d7ec25d8426eb5853bb82ab42b.jpg'] },
  { breed: 'Poodle', color: 'Brown', images: ['https://cdn.prod.website-files.com/5f7adfe5ed7d773f90050d9e/627499b029c8d366a371b423_poodle-malaysia.jpg', 'https://imageserver.petsbest.com/marketing/blog/toy-poodle.jpg', 'https://image.petmd.com/files/styles/978x550/public/2023-01/toy-poodle.jpg', 'https://t3.ftcdn.net/jpg/10/78/20/96/360_F_1078209639_1njc8r8L2ba1k5nmv9KWqOSv3F2EM5We.jpg'] },
  { breed: 'Standard Poodle', color: 'Apricot', images: ['https://www.animalkingdomaz.com/wp-content/uploads/1646515_800.jpg', 'https://i.pinimg.com/474x/39/3d/b8/393db88fa5153c73013246c954eace31.jpg', 'https://i.pinimg.com/474x/1c/86/ff/1c86ffbd30f51d97751652e78aeca91d.jpg', 'https://i.pinimg.com/1200x/02/78/e6/0278e6713e7f1e5398a231b5da34f4b6.jpg'] },
  { breed: 'Beagle', color: 'Tri-color', images: ['https://i.pinimg.com/736x/84/d9/9e/84d99e2eef6632f3c2883a0b5aaae153.jpg', 'https://i.pinimg.com/736x/b8/95/5f/b8955fe8ee0920d27356ffd9c8f56952.jpg', 'https://i.pinimg.com/474x/cb/b9/93/cbb993d60fb33edafc77d33784054604.jpg', 'https://static.vecteezy.com/system/resources/previews/006/692/772/large_2x/adorable-tricolor-beagle-on-white-screen-beagles-are-used-in-a-range-of-research-procedures-the-general-appearance-of-the-beagle-resembles-a-miniature-foxhound-beagles-have-excellent-noses-free-photo.jpg'] },
  { breed: 'Great Dane', color: 'Harlequin', images: ['https://i.pinimg.com/736x/25/58/e2/2558e280c3f17dc59c38c7808410f8b6.jpg', 'https://i.pinimg.com/236x/5e/e3/ce/5ee3cebfb8e95004b204a44e79c72909.jpg', 'https://i.pinimg.com/474x/eb/11/98/eb119845e17158af90e3ed4fe0cf607e.jpg', 'https://i.pinimg.com/736x/16/34/e0/1634e04165b9903f00259a21794dc63f.jpg'] },
  { breed: 'Border Collie', color: 'Black and White', images: ['https://i.pinimg.com/736x/71/3f/c4/713fc44f1affd3bdeb8ec285e2e6c173.jpg', 'https://i.pinimg.com/736x/6d/15/7d/6d157d54efc645d26de928af63491543.jpg', 'https://i.pinimg.com/736x/0a/65/41/0a654108635443625c663d72d0190c46.jpg', 'https://i.pinimg.com/736x/91/90/0c/91900c9e620d5c8423e5ac4eb63e3d06.jpg'] },
  { breed: 'Dachshund', color: 'Mahogany', images: ['https://i.pinimg.com/736x/4a/62/86/4a628693b2ec63a3edeea158784c5857.jpg', 'https://i.pinimg.com/474x/05/1e/d5/051ed5dbdab111fc39d4b77dd20626dd.jpg', 'https://i.pinimg.com/236x/42/65/f6/4265f6715451047c54b6b14a6c33384d.jpg', 'https://www.k9web.com/wp-content/uploads/2019/01/smooth-haired-dachshund-dog.jpg'] },
  { breed: 'Cocker Spaniel', color: 'Chestnut', images: ['https://i.pinimg.com/736x/14/b8/67/14b8674b288a60730cffca81e8ee219e.jpg', 'https://i.pinimg.com/736x/a1/4c/e1/a14ce1ee3ba133d5512aed5d3e263a4d.jpg', 'https://i.pinimg.com/736x/0b/39/fd/0b39fd011bde3608de3bcd7e9696b2db.jpg', 'https://i.pinimg.com/736x/bd/2d/f2/bd2df264e948f34464bc263ec89d431d.jpg'] },
  { breed: 'Italian Greyhound', color: 'Dark Gray', images: ['https://i.pinimg.com/736x/7d/1c/76/7d1c762c3d24ddc5b5d5b21664e5335b.jpg', 'https://i.pinimg.com/474x/a7/7f/b8/a77fb8704d85f8acbb6be3acb8bf2542.jpg', 'https://i.pinimg.com/474x/a6/ac/49/a6ac49acf998fb6f7969087b881afca9.jpg', 'https://i.pinimg.com/236x/db/0b/99/db0b99e9f9247ff214f4042a7fbbf6d0.jpg'] },
  { breed: 'Shetland Sheepdog', color: 'Sable', images: ['https://i.pinimg.com/736x/49/77/c6/4977c6320d8b4d99f45001f8815d9104.jpg', 'https://i.pinimg.com/736x/4b/26/76/4b26761adc608fc91fbd32f20ac87546.jpg', 'https://i.pinimg.com/736x/62/f9/c0/62f9c00035ce243c9d23dc233f05fdf6.jpg', 'https://i.pinimg.com/736x/e3/3a/bb/e33abb165323b5666c6577788c5e1375.jpg'] },
  { breed: 'Irish Setter', color: 'Red and White', images: ['https://i.pinimg.com/474x/30/3a/44/303a447e8b1f517159a520f81485dd5b.jpg', 'https://i.pinimg.com/736x/78/a6/d0/78a6d08736c2f7de7f8a0ad5fa641ece.jpg', 'https://i.pinimg.com/236x/96/09/bf/9609bfdd01e103e094a6000882607cf8.jpg', 'https://i.pinimg.com/736x/c4/84/68/c484681a4e76b67018e1c231deb5dfee.jpg'] },
  { breed: 'Boston Terrier', color: 'Seal', images: ['https://i.pinimg.com/736x/d7/23/9d/d7239daf76c8765892b8e8a75de50995.jpg', 'https://i.pinimg.com/736x/b3/09/10/b309101dc226e6b9cf718e4f4ab65c12.jpg', 'https://i.pinimg.com/474x/eb/92/6f/eb926f5bdad0470cd31836cfac52e4a2.jpg', 'https://i.pinimg.com/736x/a6/31/c2/a631c264d171a1d686ae2645f9c6940b.jpg'] },
  { breed: 'Chihuahua', color: 'Tan', images: ['https://i.pinimg.com/736x/29/14/2e/29142e29aec32abb826181023999ac70.jpg', 'https://i.pinimg.com/736x/fe/75/17/fe751783903cddae555a0b1096aedac7.jpg', 'https://i.pinimg.com/736x/0a/ab/b1/0aabb1efd6d116fdbb3c24892d35b73f.jpg', 'https://i.pinimg.com/564x/99/65/8a/99658ad610fc4ca756c70f52b18e3bc0.jpg'] },
  { breed: 'Cane Corso', color: 'Black', images: ['https://i.pinimg.com/1200x/c9/06/b1/c906b1987019472dfb49dc7fe74bcb98.jpg', 'https://i.pinimg.com/736x/39/65/af/3965af34ba2fac15c9b2c17d4523cc33.jpg', 'https://i.pinimg.com/474x/77/ff/59/77ff598423e180ffb66cfa388da5d545.jpg', 'https://i.pinimg.com/736x/9c/2b/6b/9c2b6b38cc5b63bff28ee5cf7b8cb633.jpg'] },
  { breed: 'Maltese', color: 'Cream', images: ['https://i.pinimg.com/236x/4b/3f/00/4b3f00b7845e4e2ff3ad8d2dc681985c.jpg', 'https://i.pinimg.com/236x/63/e5/48/63e5487675b1236348bd752cc1e800b9.jpg', 'https://i.pinimg.com/736x/0b/58/a7/0b58a7c9c2faf9b29cedc102ed8df49f.jpg', 'https://i.pinimg.com/236x/4b/d7/6d/4bd76dcfdbd51e7707d3f1982f5c8f05.jpg'] },
  { breed: 'Vizsla', color: 'Orange-red', images: ['https://i.pinimg.com/236x/8f/4b/e8/8f4be8282b2e0b37c78f29db2963eaf8.jpg', 'https://i.pinimg.com/474x/7d/d3/e5/7dd3e53bb1abc23dbdb24218bfcec131.jpg', 'https://i.pinimg.com/736x/3a/65/12/3a65124dd680b8cddb0902a2f69bfed7.jpg', 'https://i.pinimg.com/736x/a2/bf/21/a2bf2196ecad1d950d29b713c0063faf.jpg'] },
  { breed: 'Doberman Pinscher', color: 'Rust-colored', images: ['https://i.pinimg.com/736x/13/22/47/13224703c6d608c9848960247bb31f60.jpg', 'https://i.pinimg.com/736x/1b/06/36/1b063646692cb3591cd820a2b78f3472.jpg', 'https://i.pinimg.com/1200x/35/06/cb/3506cb87d247b529c298b85460f62225.jpg', 'https://i.pinimg.com/564x/98/aa/7b/98aa7bf0f10f717bc255e83550bb2f6f.jpg'] },
  { breed: 'Great Dane', color: 'Blue', images: ['https://i.pinimg.com/564x/50/00/4b/50004b1db3beffee079b6134c8ef6165.jpg', 'https://i.pinimg.com/736x/f6/4f/7c/f64f7cfad0ce9fe75c1e3575cffcaaf6.jpg', 'https://i.pinimg.com/736x/ae/23/b2/ae23b20dac1786b777a0dceef7276f7a.jpg', 'https://i.pinimg.com/736x/39/ff/6a/39ff6a83862798107679da66f1d1bf0f.jpg'] },
  { breed: 'Samoyed', color: 'White', images: ['https://i.pinimg.com/736x/7b/28/03/7b28030ca740a0d7ee4461698f7abd3f.jpg', 'https://i.pinimg.com/736x/73/04/df/7304df16d26bd2cd5e7b8d1d627bd299.jpg', 'https://i.pinimg.com/736x/00/d9/ea/00d9eaaf533b92ccb1affc584c162677.jpg', 'https://i.pinimg.com/474x/c8/44/21/c84421237e81b8533117615e1506b5ee.jpg'] },
  { breed: 'Goldendoodle', color: 'Chocolate', images: ['https://i.pinimg.com/736x/ee/c5/4f/eec54fd4c4c0e0a4b731e8dcb505858c.jpg', 'https://i.pinimg.com/474x/94/23/79/942379c8a17a0b4f34fdd3b80ffd5416.jpg', 'https://i.pinimg.com/236x/af/da/e2/afdae2f44ea4f8cf4ebc1ee6d3cc14c7.jpg', 'https://i.pinimg.com/736x/4a/ed/2c/4aed2c7a0718864bf1c74c2d99a9bd2d.jpg'] },
  { breed: 'Weimaraner', color: 'Gray', images: ['https://upload.wikimedia.org/wikipedia/commons/1/16/Weimaraner_wb.jpg', 'https://breed-assets.wisdompanel.com/dog/weimaraner/Weimaraner1.jpg', 'https://dogtime.com/wp-content/uploads/sites/12/2023/08/GettyImages-1307906396-e1691427357300.jpg', 'https://www.akc.org/wp-content/uploads/2017/11/Weimaraner-On-White-01.jpg'] },
  { breed: 'Australian Cattle Dog', color: 'Blue Heeler', images: ['https://www.akc.org/wp-content/uploads/2017/11/Australian-Cattle-Dog-laying-down-in-the-grass.jpg', 'https://cdn.britannica.com/50/236050-050-5AA32B83/Australian-cattle-dog.jpg', 'https://www.akc.org/wp-content/uploads/2017/11/Australian-Cattle-Dog-standing-outdoors.jpg'] }
];

// --- Helper Data & Functions ---

// Possible personality traits
const personalities = [
    'Friendly', 'Playful', 'Calm', 'Active', 'Gentle', 
    'Smart', 'Loyal', 'Energetic', 'Affectionate', 'Independent',
    'Curious', 'Brave', 'Shy', 'Outgoing', 'Obedient', 'Stubborn'
];

// Possible requirements/needs
const requirements = [
    'Good with kids', 'Needs yard', 'Indoor only', 'Regular exercise',
    'Training required', 'No small children', 'Experienced owner preferred',
    'Regular grooming needed', 'Special diet required', 'Good with other dogs',
    'Not good with cats', 'Needs mental stimulation'
];

// Possible checklist items based on schema enum
const checklistItems = [
    'Can live with children', 'Vaccinated', 'House trained',
    'Neutered', 'Up-to-date shots', 'Microchipped'
];

// Function to get a random subset of an array
const getRandomSubset = (arr, count) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Function to get breed-specific size (example, expand as needed)
const getBreedSize = (breed) => {
    const lowerBreed = breed.toLowerCase();
    if (['chihuahua', 'pomeranian', 'maltese', 'pug', 'french bulldog', 'italian greyhound', 'dachshund', 'boston terrier'].some(b => lowerBreed.includes(b))) return 'small';
    if (['great dane', 'cane corso', 'doberman pinscher', 'german shepherd', 'samoyed', 'siberian husky', 'labrador retriever', 'golden retriever', 'standard poodle', 'vizsla', 'irish setter', 'weimaraner'].some(b => lowerBreed.includes(b))) return 'large';
    // Default to medium for others like Corgi, Beagle, Aussie, Border Collie, Cocker Spaniel, Sheltie, Goldendoodle, Cattle Dog
    return 'medium';
};

// Function to get approximate weight/height based on size (example ranges)
const getDimensions = (size) => {
    let weight, height;
    if (size === 'small') {
        weight = (2 + Math.random() * 8).toFixed(1); // ~2-10 kg
        height = (15 + Math.random() * 20).toFixed(1); // ~15-35 cm
    } else if (size === 'medium') {
        weight = (10 + Math.random() * 15).toFixed(1); // ~10-25 kg
        height = (35 + Math.random() * 20).toFixed(1); // ~35-55 cm
    } else { // large
        weight = (25 + Math.random() * 35).toFixed(1); // ~25-60 kg
        height = (55 + Math.random() * 25).toFixed(1); // ~55-80 cm
    }
    return { weight, height };
};

// Function to generate a single dog object based on the specific data
const generateDog = (dogInfo, index) => {
    const gender = Math.random() < 0.5 ? 'male' : 'female';
    const age = Math.floor(Math.random() * 28) + 3; // 3 to 30 months
    const size = getBreedSize(dogInfo.breed);
    const { weight, height } = getDimensions(size);
    const selectedPersonalities = getRandomSubset(personalities, 3);
    const selectedRequirements = getRandomSubset(requirements, 2);

    // Ensure we have at least one valid image URL
    const mainImageUrl = dogInfo.images[0];
    const additionalImages = dogInfo.images.slice(1);

    // Generate description with proper breed and age
    const description = generateDogDescription(dogInfo.breed, age, gender, dogInfo.color, selectedPersonalities);

    // Ensure required fields match the Dog schema
    return {
        name: `${dogInfo.breed.split(' ')[0]}${index + 1}`,
        breed: dogInfo.breed,
        age,
        size,
        gender,
        description,
        personality: selectedPersonalities,
        requirements: selectedRequirements,
        vaccinated: Math.random() > 0.1,
        neutered: Math.random() > 0.2,
        status: 'available',
        imageUrl: mainImageUrl,
        images: additionalImages,
        checklist: [
            'Can live with children',
            'Vaccinated',
            'House trained',
            'Neutered',
            'Up-to-date shots',
            'Microchipped'
        ].filter(() => Math.random() > 0.3),
        color: dogInfo.color,
        weight: weight.toString(),
        height: height.toString(),
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
        healthRecords: [{
            type: 'Initial Checkup',
            description: 'General health assessment upon arrival.',
            date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
        }],
        vaccinations: [
            { age: '8 weeks', vaccinated: 'DHPP', match: 'Complete' },
            { age: '12 weeks', vaccinated: 'Rabies', match: 'Complete' },
            { age: '16 weeks', vaccinated: 'DHPP Booster', match: age >= 4 ? 'Complete' : 'Due' }
        ],
        translations: {
            zh: {
                name: `狗狗${index + 1}`,
                description: generateChineseDescription(dogInfo.breed, age, gender, dogInfo.color)
            }
        },
        health: [
            "General Health Check",
            "Vaccinations Up-to-date",
            "Deworming Treatment"
        ]
    };
};

// Add helper function for Chinese description
const generateChineseDescription = (breed, age, gender, color) => {
    const genderText = gender === 'male' ? '他' : '她';
    return `這隻${age}個月大的${color}色${breed}正在尋找一個永遠的家。${genderText}非常友善和活潑。`;
};

// --- Seeding Logic ---
const seedDatabase = async () => {
    let connection;
    try {
        // Connect to MongoDB using config
        console.log(`Connecting to MongoDB at ${config.database.url}...`);
        connection = await mongoose.connect(config.database.url, config.database.options);
        console.log('Connected to MongoDB successfully.');

        // Clear existing dogs
        console.log('Clearing existing dogs collection...');
        const deleteResult = await Dog.deleteMany({});
        console.log(`Cleared ${deleteResult.deletedCount} existing dog records.`);

        // Generate new dog data from the specific list
        console.log('Generating new dog data from the provided list...');
        const dogsToInsert = specificDogData.map((dogInfo, index) => generateDog(dogInfo, index));
        
        // Insert new dogs
        console.log(`Inserting ${dogsToInsert.length} new dog records...`);
        const insertResult = await Dog.insertMany(dogsToInsert);
        console.log(`Successfully inserted ${insertResult.length} new dog records.`);

        // Verify the seeding
        const count = await Dog.countDocuments();
        console.log(`Verification: Current dog count in database: ${count}`);

        // Optional: Print one sample record to verify structure
        if (count > 0) {
            const sampleDog = await Dog.findOne();
            console.log('\nSample dog record inserted:');
            console.log(JSON.stringify(sampleDog, null, 2));
        } else {
            console.log('No dogs were inserted.');
        }

    } catch (error) {
        console.error('Error during database seeding:', error);
        // Log specific Mongoose validation errors if available
        if (error.name === 'ValidationError') {
            for (let field in error.errors) {
                console.error(`Validation Error (${field}): ${error.errors[field].message}`);
            }
        }
        process.exit(1); // Exit with error code
    } finally {
        // Ensure database connection is closed
        if (connection) {
            await mongoose.disconnect();
            console.log('Database connection closed.');
        }
    }
};

// --- Run Seeding ---
console.log('Starting database seeding process with specific dog data...');
seedDatabase()
    .then(() => {
        console.log('Seeding completed successfully.');
        process.exit(0); // Exit successfully
    })
    .catch(error => {
        // Error is already logged in seedDatabase function
        console.error('Seeding process failed.');
        process.exit(1); // Exit with error code
    });
