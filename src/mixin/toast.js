export default {
  data() {
    return {
      errorToast: {
        visible: false,
        message: '',
      },
    }
  },
  methods: {
    showToast(err) {
      this.errorToast.visible = true
      this.errorToast.message = err.msg
      setTimeout(() => {
        this.errorToast = {
          visible: false,
          message: '',
        }
      }, 2000)
    },
  },
}
