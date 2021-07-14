<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            bottom-slots
            v-model="newTweetContent"
            placeholder="What's happening?"
            counter
            maxlength="280"
            autogrow
            class="new-tweet"
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="https://cdn.quasar.dev/img/avatar1.jpg" />
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            @click="addNewTweet"
            unelevated
            rounded
            color="primary"
            label="Tweet"
            no-caps
            :disable="!newTweetContent"
            class="q-mb-lg"
          />
        </div>
      </div>
      <q-separator size="10px" color="grey-2" class="divider" />

      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item class="q-py-md" v-for="tweet in tweets" :key="tweet.id">
            <q-item-section avatar top>
              <q-avatar size="xl">
                <img src="https://cdn.quasar.dev/img/avatar1.jpg" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>Seongyup Kim</strong>
                <span class="text-grey-7">
                  @yupyup <br class="lt-md" />
                  &bull; {{ relativeDate(tweet.date) }}
                </span>
              </q-item-label>
              <q-item-label class="tweet-content text-body1">
                {{ tweet.content }}
              </q-item-label>
              <div class="row justify-between q-mt-sm tweet-icons">
                <q-btn flat round color="grey" icon="comment" size="sm" />
                <q-btn flat round color="grey" icon="share" size="sm" />
                <q-btn
                  flat
                  round
                  :color="tweet.liked ? 'pink' : 'grey'"
                  :icon="tweet.liked ? 'favorite' : 'favorite_border'"
                  size="sm"
                  @click="toggleLiked(tweet)"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  icon="delete"
                  size="sm"
                  @click="deleteTweet(tweet)"
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script lang="ts">
import db from 'src/boot/firebase';
import { defineComponent } from 'vue';
import { formatDistance } from 'date-fns';

interface Tweet {
  id: string;
  content: string;
  date: number;
  liked: boolean;
}

export default defineComponent({
  name: 'PageHome',
  data() {
    return {
      newTweetContent: '',
      tweets: [] as Tweet[],
    };
  },
  methods: {
    relativeDate(value: number) {
      return formatDistance(value, new Date());
    },
    addNewTweet() {
      db.collection('tweets')
        .add({
          content: this.newTweetContent,
          date: Date.now(),
          liked: false,
        })
        .then((docRef) => {
          console.log('Document written with ID: ', docRef.id);
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });

      this.newTweetContent = '';
    },
    deleteTweet(tweetToDelete: Tweet) {
      db.collection('tweets')
        .doc(tweetToDelete.id)
        .delete()
        .then(() => {
          console.log('Document successfully deleted!');
        })
        .catch((error) => {
          console.error('Error removing document: ', error);
        });
    },
    toggleLiked(tweet: Tweet) {
      db.collection('tweets')
        .doc(tweet.id)
        .update({
          liked: !tweet.liked,
        })
        .then(() => {
          console.log('Document successfully updated!');
        })
        .catch((error) => {
          console.error('Error updating document: ', error);
        });
    },
  },
  mounted() {
    db.collection('tweets')
      .orderBy('date')
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const tweetChange = {
            id: change.doc.id,
            ...change.doc.data(),
          } as Tweet;
          if (change.type === 'added') {
            console.log('added');
            this.tweets = [tweetChange].concat(this.tweets);
          }
          if (change.type === 'modified') {
            this.tweets = this.tweets.map((tweet) => {
              if (tweet.id === tweetChange.id) {
                return tweetChange;
              } else {
                return tweet;
              }
            });
          }
          if (change.type === 'removed') {
            this.tweets = this.tweets.filter(
              (tweet) => tweet.id !== tweetChange.id
            );
          }
        });
      });
  },
});
</script>
<style lang="sass">
.new-tweet
  textarea
    font-size: 20px
    line-height: 1.5 !important

.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4

.tweet-content
    white-space: pre-line

.tweet-icons
  margin-left: -5px
</style>
