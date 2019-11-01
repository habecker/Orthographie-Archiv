<template>
    <modal :value="value" @cancel="$emit('cancel')">
        <template v-if="value" v-slot:title>
            <span class="is-hidden-tablet is-size-6" :class="{'has-tooltip-bottom': value['file'].length > 30}" :data-tooltip="value['file']">{{ value['file'] | maxnchars(30) }}</span>
            <span class="is-hidden-mobile is-size-6" :class="{'has-tooltip-bottom': value['file'].length > 60}" :data-tooltip="value['file']">{{ value['file'] | maxnchars(60) }}</span>
        </template>
        <template v-if="value" v-slot:content>
            <div class="columns">
                <div class="column">
                    <div class="field is-grouped is-grouped-multiline">
                        <div class="control">
                            <span class="tags has-addons">
                                <span class="tag is-dark" aria-label="Jahr"><calendar-icon/></span>
                                <span class="tag is-light is-info">{{ value.year }}</span>
                            </span>
                        </div>
                        <div class="control">
                            <span class="tags has-addons">
                                <span class="tag is-dark" aria-label="Auflage"><numeric-icon/></span>
                                <span class="tag is-light" :class="{'has-tooltip-bottom': value.edition_text.length > 15}" :data-tooltip="value.edition_text">{{ value.edition_text | maxnchars(15) }}</span>
                            </span>
                        </div>
                        <div class="control">
                            <span class="tags has-addons">
                                <span class="tag is-dark" aria-label="Thema"><folder-text-icon/></span>
                                <span class="tag is-light" :class="{'has-tooltip-bottom': value.topic.length > 20}" :data-tooltip="value.topic">{{ value.topic | maxnchars(20) }}</span>
                            </span>
                        </div>
                    </div>
                    <div class="field is-grouped is-grouped-multiline">
                        <div class="control" v-for="tag in value.tags" :key="tag">
                            <span class="tags has-addons">
                                <span class="tag is-dark" aria-label="Begriff"><tag-icon/></span>
                                <span class="tag is-secondary">{{ tag }}</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="column is-two-third" id="preview" v-html="value.html">
                </div>
            </div>
        </template>
        <template v-if="value" v-slot:footer>
            <div class="field is-pulled-left">
                <a class="button" :href="'/api/download/'+value['id']">
                    <download-icon></download-icon> Herunterladen
                </a>
            </div>
        </template>
    </modal>
</template>
<script>
import $ from 'jquery'
import Vue from 'vue'

export default {
    name: 'ResultModal',
    props: ['value'],
    mounted() {
    },
    watch: {
        'value': function () {
            if (this.$store.state.searchRequest.is_regex || this.$store.state.searchRequest.expression.length > 0)
                Vue.nextTick()
                .then(function () {
                    var container = $('section.modal-card-body')[0],
                        scrollTo = $('.has-background-warning')[0];
                    if (container && scrollTo) {
                        container.scrollTop = scrollTo.offsetTop - 3*scrollTo.offsetHeight - container.offsetHeight/2// - container.offsetTop + container.scrollTop
                    }
                })
            else          
                Vue.nextTick()
                .then(function () {
                    var container = $('section.modal-card-body')[0];
                    if (container) {
                        container.scrollTop = 0
                    }
                })
        }
    }
}
</script>
<style lang="sass" scoped>
    $modal-content-width: 800px
</style>
<style lang="css">
    #preview * {
        font-family: inherit;
    }
</style>