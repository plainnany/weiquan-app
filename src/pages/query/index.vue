<template>
  <query-content :from="'query'" />
</template>

<script>
import QueryContent from '@/components/query-content'
import { setTitle } from '@/utils'

export default {
  components: {
    QueryContent,
  },
  data() {
    return {}
  },
  mounted() {
    setTitle({ title: '查询&修改' })
  },
}
</script>
