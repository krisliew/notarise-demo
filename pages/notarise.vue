<template>
  <section>
    <div class="container">
      <h1>Notarise a Certificate</h1>
      <b-form style="padding-top: 20px;" @submit.prevent="notariseFile">
        <b-form-group
          label="Certificate Title:"
          label-cols-sm="3"
          style="max-width: 480px;"
        >
          <b-form-input v-model="title" type="text" @keyup="titleCheck" />
          <p class="text-error">{{ titleErr }}</p>
        </b-form-group>

        <b-form-group
          label="Certificate File:"
          label-for="file-default"
          label-cols-sm="3"
          style="max-width: 480px;"
        >
          <b-form-file ref="file-input" v-model="file"></b-form-file>
          <p class="text-error">{{ fileErr }}</p>
          <p v-if="file" class="">
            Selected file: <b>{{ file ? file.name : '' }}</b>
          </p>
          <b-button v-if="file" variant="info" @click="file = null"
            >Clear selected file</b-button
          >
        </b-form-group>

        <div style="max-width: 960px;">
          <b-button
            style="text-align: center;"
            variant="primary"
            @click="hashFile"
          >
            Issue Certificate
          </b-button>
        </div>
      </b-form>
      <hr />
      <h2 style="padding-bottom: 50px;">Notarisation output:</h2>
      <p>Certificate File's Hash: {{ fileHash }}</p>
      <p>
        View transaction status on Blockchain:
        <a
          :href="nodeUrl + '/transaction/' + lastTxHash + '/status'"
          target="_blank"
          >{{ lastTxHash }}</a
        >
      </p>
      <p>
        View transaction on Explorer:
        <a
          :href="
            'http://explorer-951.symboldev.network/transaction/' + lastTxHash
          "
          target="_blank"
          >{{ lastTxHash }}</a
        >
      </p>
    </div>
  </section>
</template>

<script>
/* eslint-disable no-console */
/* eslint-disable no-global-assign */
import {
  Account,
  Address,
  Deadline,
  NetworkType,
  PlainMessage,
  TransferTransaction,
  RepositoryFactoryHttp,
  UInt64,
} from 'symbol-sdk'
import { PDFDocument } from 'pdf-lib'
const operators1 = require('rxjs/operators')

export default {
  data() {
    return {
      // DB:
      title: '',
      titleErr: '',
      file: null,
      fileData: '',
      fileErr: '',
      // blockchain config
      nodeUrl:
        'http://api-01.ap-southeast-1.testnet-0951-v1.symboldev.network:3000',
      networkGenerationHash:
        '4009619EB7A9F824C5D0EE0E164E0F99CCD7906A475D7768FD60B452204BD0A2',
      networkType: NetworkType.TEST_NET,

      loader: null,
      interval: null,
      timeOuter: null,
      // blockchain:
      privateKey:
        '609267B3F665C685D10ADC249B14B4308728E9009B86F2B2B88F1F27B0E870AE', // Sender account
      notarisationAddr: 'TAUSJXSGAZSLAX2SYHRHWPAHOLTRYMFB5L3QVC5K', // Address that store notarisation of cert
      fileHash: '', // File hash
      lastTxHash: '', // tx hash of the issued cert
      txCounter: 0, // a counter used to send error that a tx fail after 30s
    }
  },
  methods: {
    hashFile() {
      // Step 1
      if (this.titleCheck() * this.certCheck() === 1) {
        self = this
        const reader = new FileReader()
        // Load the event below after reader.readAsArrayBuffer() finish reading the file input
        reader.onload = function (event) {
          const data = new Uint8Array(event.target.result)
          self.fileHash = self.CryptoJS.SHA256(data)
          self.fileData = data
          self.notariseFile(self.fileHash)
        }
        reader.readAsArrayBuffer(this.file)
      }
    },
    titleCheck() {
      if (this.title) {
        if (this.title.length > 128) {
          this.titleErr =
            'Length of certificate title must not exceed 128 character'
          return false
        } else {
          this.titleErr = ''
          return true
        }
      } else {
        this.titleErr = 'Please input certificate title'
        return false
      }
    },
    certCheck() {
      if (this.file) {
        this.fileErr = ''
        return true
      } else {
        this.fileErr = 'Please input the certificate file'
        return false
      }
    },
    notariseFile(fileHash) {
      // Step 2
      const sender = Account.createFromPrivateKey(
        this.privateKey,
        this.networkType
      )
      const recipient = Address.createFromRawAddress(this.notarisationAddr)
      const repositoryFactory = new RepositoryFactoryHttp(this.nodeUrl)
      const transactionHttp = repositoryFactory.createTransactionRepository()

      const transferTransaction = TransferTransaction.create(
        Deadline.create(),
        recipient,
        [],
        PlainMessage.create('' + fileHash),
        this.networkType,
        UInt64.fromUint(2000000)
      )
      const signedTransaction = sender.sign(
        transferTransaction,
        this.networkGenerationHash
      )
      this.lastTxHash = signedTransaction.hash

      transactionHttp.announce(signedTransaction).subscribe(
        (x) => {
          console.log(x)
          this.loader = this.$loading.show({
            // show loading overlay
            container: this.fullPage ? null : this.$refs.formContainer,
            canCancel: false,
            onCancel: this.onCancel,
            color: 'white',
            loader: 'bars',
            backgroundColor: '#000000',
            opacity: 0.7,
            zIndex: 100,
          })
          this.interval = setInterval(() => {
            this.checkTxStatus(signedTransaction.hash)
          }, 3000)
        },
        (err) => console.error(err)
      )
    },
    checkTxStatus(txHash) {
      // Step 3
      const repositoryFactory = new RepositoryFactoryHttp(this.nodeUrl)
      const transactionHttp = repositoryFactory.createTransactionRepository()

      transactionHttp
        .getTransactionStatus(txHash)
        .pipe(operators1.map((x) => x))
        .subscribe(
          (response) => {
            console.log(response)
            if (response.group === 'confirmed' && response.code === 'Success') {
              clearInterval(this.interval)
              this.promptDownload(txHash)
            } else if (
              response.group === 'unconfirmed' &&
              response.code === 'Success'
            ) {
              clearTimeout(this.timeOuter)
              this.$bvToast.toast(`Waiting for blockchain confirmation...`, {
                title: 'Notarise Notification',
                autoHideDelay: 3000,
                appendToast: false,
              })
            }
          },
          (err) => {
            this.timeOuter = setTimeout(() => {
              this.txCounter = 10
            }, 30000)
            if (this.txCounter === 10) {
              console.log(err)
              clearInterval(this.interval)
              this.loader.hide() // Hide loader
              this.$bvToast.toast(
                `Unable to issue certificate on blockchain. Please try again later`,
                {
                  title: 'Notarise Notification',
                  autoHideDelay: 3000,
                  appendToast: false,
                }
              )
            }
          }
        )
    },
    async promptDownload(txHash) {
      // Step 4: Prompt download of the notarised file
      this.loader.hide()
      this.$bvToast.toast(
        `A download of the notarised certificate should begin shortly...`,
        {
          title: 'Completion of Notarisation',
          autoHideDelay: 3000,
          appendToast: false,
          variant: 'success',
        }
      )
      const pdfDoc = await PDFDocument.load(this.fileData)
      pdfDoc.setTitle(this.title)
      pdfDoc.setAuthor('NotoCert Demo')
      pdfDoc.setCreator('Soon Jing + Symbol Blockchain v951')
      pdfDoc.setProducer(
        'Soon Jing (https://github.com/soonjing/notarise-demo)'
      )
      pdfDoc.setKeywords([this.lastTxHash])

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = pdfDoc.getTitle() + '(Notarised Certificate)'
      link.click()
      URL.revokeObjectURL(link.href)
    },
  },
  head() {
    return { title: 'Notarise Certificate' }
  },
}
</script>

<style scoped>
section {
  padding-top: 50px;
}
.text-error {
  padding-top: 5px;
  color: #fa4848;
  margin: 0 0 7px 0;
  font-size: 12px;
  max-width: 100%;
}
</style>
