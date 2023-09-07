const router = require('express').Router()
const urlController = require('../controller/urlController')

router.get('/', urlController.consultURL)
router.post('/', urlController.shortenURL)
router.delete('/:new_url', urlController.deletURL)
module.exports = router 