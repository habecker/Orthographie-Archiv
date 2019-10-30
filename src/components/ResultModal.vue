<template>
    <modal :value="value" @cancel="$emit('cancel')">
        <template v-slot:title>HELO</template>
        <template v-slot:content></template>
        <template v-slot:footer></template>
    </modal>
</template>
<script>
export default {
    name: 'ResultModal',
    props: ['value'],
}
</script>
<style lang="scss" scoped>
    $modal-content-width: 800px;
</style>