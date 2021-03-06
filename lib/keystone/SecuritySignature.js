const keystone = require('keystone')
const { publicKeyToAddress } = requireRoot('lib/utils')
const Types = keystone.Field.Types

const SecuritySignature = new keystone.List('SecuritySignature', {
  // nocreate: true,
  // noedit: true,
  label: 'Signatures',
  map: { name: 'display' },
  track: {
    createdAt: true
  }
})

SecuritySignature.add({
  type: {
    type: Types.Select,
    options: [
      { value: 'ethereum-public-key', label: 'Ethereum Public Key' }
    ],
    default: 'ethereum-public-key',
    noedit: true,
    initial: true,
    required: true
  },
  value: { type: String, noedit: true, initial: true },
  display: { type: String, noedit: true, initial: false, hidden: true },
  user: { type: Types.Relationship, ref: 'SecurityUser', required: true, noedit: true, initial: true }
})

SecuritySignature.schema.pre('save', function (next) {
  switch (this.type) {
    case 'ethereum-public-key':
      this.display = publicKeyToAddress(this.value)
      break
    default:
      this.display = this.value
  }
  next()
})

SecuritySignature.defaultColumns = 'display, user, type'

SecuritySignature.register()
