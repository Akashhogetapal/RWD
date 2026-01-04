const { signup, login } = require('../middleware/serverside');
const { signup2, login2, forget, verify, reset } = require('../controller/controller');
const { filter, search } = require('../controller/dbfilter');
const { add2cart, returncart, deleteItem, removeQuantity, clearcart, getorder } = require('../controller/cart');
const getCart = require('../controller/getCart');
const { getwallet, updatewallet } = require('../controller/wallet');
const { profile } = require("../controller/profile")
const { createTopup, getTopups, accepttop, rejecttop, getRecentTopupHistory } = require('../controller/topup');
const { saveplanner, getplanner } = require("../controller/planner");
const { shopLogin, getShopOrders, updateOrderStatus } = require('../controller/shopController');
const router = require('express').Router();

router.post('/login', login, login2);
router.post('/signup', signup2);
router.post('/forget', forget);
router.post('/verify', verify);
router.post('/reset', reset);

router.post('/filter', filter);
router.post('/search', search);

router.post('/cart', getCart);
router.post('/add2cart', add2cart);
router.post('/returncart', returncart);
router.post('/delete-item', deleteItem);
router.post('/remove-quantity', removeQuantity);
router.post('/placeorder', clearcart);
router.post('/getwallet', getwallet);
router.post('/updatewallet', updatewallet);
router.post('/getorder', getorder);
router.get('/profile', profile);

router.post('/topup', createTopup);
router.post('/topup-history', getTopups);
router.post('/recent-topup-history', getRecentTopupHistory);
router.post('/accept-topup', accepttop);
router.post('/reject-topup', rejecttop);

router.post('/saveplanner', saveplanner);
router.get('/getplanner', getplanner)

router.post('/shop/login', shopLogin);
router.post('/shop/orders', getShopOrders);
router.post('/shop/update-status', updateOrderStatus);

const { getMyOrders } = require("../controller/userOrderController");
router.post('/my-orders', getMyOrders);

module.exports = router;
