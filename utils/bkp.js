/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from "@storybook/vue";
import {
  withKnobs,
  boolean,
  object,
  text,
  number
} from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import VuePaycard from "../src/components/VuePaycard";

const timelineStory = storiesOf("VuePaycard", module)
  .addParameters({
    backgrounds: [
      { name: "Blue", value: "blue" },
      { name: "Green", value: "green" },
      { name: "Yellow", value: "yellow" },
      { name: "Orange", value: "orange" },
      { name: "Red", value: "red" },
      { name: "Purple", value: "purple" },
      { name: "Black", value: "black" },
      { name: "White", value: "white", default: true }
    ]
  })
  .addDecorator(withKnobs);

timelineStory
  .add("Default", () => {
    const label1 = "Object 1";
    const defaultValue1 = {
      title: "Title example 1",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ex dolor, malesuada luctus scelerisque ac, auctor vitae risus. Vivamus risus dolor, faucibus a bibendum quis, facilisis eget odio. Nullam non condimentum orci, a cursus magna. Suspendisse tempor rutrum eros, non pellentesque odio commodo eu. Donec at volutpat enim. Vivamus mattis volutpat urna, sit amet vulputate mauris sollicitudin et. Proin consequat at dolor in sodales. Vestibulum vel porta turpis. Pellentesque sollicitudin justo est, ut dapibus felis luctus mollis. Suspendisse feugiat, metus ut auctor dictum, nulla dui fringilla nisl, a pulvinar ipsum justo non lacus. Integer vestibulum sapien metus, et congue felis efficitur iaculis. Aliquam et mi quis nulla molestie elementum. Vestibulum in nibh nibh."
    };
    const value1 = object(label1, defaultValue1);

    const label2 = "Object 2";
    const defaultValue2 = {
      title: "Title example 2",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ex dolor, malesuada luctus scelerisque ac, auctor vitae risus. Vivamus risus dolor, faucibus a bibendum quis, facilisis eget odio. Nullam non condimentum orci, a cursus magna. Suspendisse tempor rutrum eros, non pellentesque odio commodo eu. Donec at volutpat enim. Vivamus mattis volutpat urna, sit amet vulputate mauris sollicitudin et. Proin consequat at dolor in sodales. Vestibulum vel porta turpis. Pellentesque sollicitudin justo est, ut dapibus felis luctus mollis. Suspendisse feugiat, metus ut auctor dictum, nulla dui fringilla nisl, a pulvinar ipsum justo non lacus. Integer vestibulum sapien metus, et congue felis efficitur iaculis. Aliquam et mi quis nulla molestie elementum. Vestibulum in nibh nibh."
    };
    const value2 = object(label2, defaultValue2);

    const label3 = "Object 3";
    const defaultValue3 = {
      title: "Title example 3",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ex dolor, malesuada luctus scelerisque ac, auctor vitae risus. Vivamus risus dolor, faucibus a bibendum quis, facilisis eget odio. Nullam non condimentum orci, a cursus magna. Suspendisse tempor rutrum eros, non pellentesque odio commodo eu. Donec at volutpat enim. Vivamus mattis volutpat urna, sit amet vulputate mauris sollicitudin et. Proin consequat at dolor in sodales. Vestibulum vel porta turpis. Pellentesque sollicitudin justo est, ut dapibus felis luctus mollis. Suspendisse feugiat, metus ut auctor dictum, nulla dui fringilla nisl, a pulvinar ipsum justo non lacus. Integer vestibulum sapien metus, et congue felis efficitur iaculis. Aliquam et mi quis nulla molestie elementum. Vestibulum in nibh nibh."
    };
    const value3 = object(label3, defaultValue3);

    const items = [value1, value2, value3];

    return {
      components: { VuePaycard },
      methods: { action: action("Card Clicked!") },
      props: {
        items: {
          type: Array,
          default: [...items.map(it => ({ ...it }))]
        },
        item: {
          type: Object,
          default: object("Item selected", {
            title: "",
            content: ""
          })
        },
        itemUniqueKey: {
          type: String,
          default: text("Item unique key", "title")
        },
        titleAttr: {
          type: String,
          default: text("Title attribute", "title")
        },
        titleCentered: {
          type: Boolean,
          default: boolean("Title centered", false)
        },
        titleClass: {
          type: String,
          default: text("Set title custom class (color red)", "")
        },
        titleSubstr: {
          type: Number,
          default: number("Title substring", 18)
        },
        contentAttr: {
          type: String,
          default: text("Content attribute", "content")
        },
        contentCentered: {
          type: Boolean,
          default: boolean("Content centered", false)
        },
        contentClass: {
          type: String,
          default: text("Set content custom class (color red)", "")
        },
        contentSubstr: {
          type: Number,
          default: number("Content substring", 250)
        },
        minWidth: {
          type: String,
          default: `${number("Timeline min-width", 200)}px`
        },
        minHeight: {
          type: String,
          default: `${number("Timeline min-height", 0)}px`
        },
        timelinePadding: {
          type: String,
          default: `${number("Timeline padding", 0)}px`
        },
        timelineBackground: {
          type: String,
          default: text("Timeline background (hex/rgb)", "#E9E9E9")
        },
        lineColor: {
          type: String,
          default: text("Line color (hex/rgb)", "#03A9F4")
        },
        clickable: {
          type: [String, Boolean],
          default: boolean("Clickable", true)
        }
      },
      template: `<vue-horizontal-timeline
      :items="items"
      :item-selected.sync="item"
      :item-unique-key="itemUniqueKey"
      :title-centered="titleCentered"
      :title-attr="titleAttr"
      :title-class="titleClass ? 'custom-class' : ''"
      :title-substr="titleSubstr"
      :content-centered="contentCentered"
      :content-attr="contentAttr"
      :content-class="contentClass ? 'custom-class' : ''"
      :content-substr="contentSubstr"
      :min-width="minWidth"
      :min-height="minHeight"
      :timeline-padding="timelinePadding"
      :timeline-background="timelineBackground"
      :line-color="lineColor"
      :clickable="clickable"
      @click="action"
    />`
    };
  })
  .add("Slot", () => {
    const label1 = "Object 1";
    const defaultValue1 = {
      title: "Title example 1",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ex dolor, malesuada luctus scelerisque ac, auctor vitae risus. Vivamus risus dolor, faucibus a bibendum quis, facilisis eget odio. Nullam non condimentum orci, a cursus magna. Suspendisse tempor rutrum eros, non pellentesque odio commodo eu. Donec at volutpat enim. Vivamus mattis volutpat urna, sit amet vulputate mauris sollicitudin et. Proin consequat at dolor in sodales. Vestibulum vel porta turpis. Pellentesque sollicitudin justo est, ut dapibus felis luctus mollis. Suspendisse feugiat, metus ut auctor dictum, nulla dui fringilla nisl, a pulvinar ipsum justo non lacus. Integer vestibulum sapien metus, et congue felis efficitur iaculis. Aliquam et mi quis nulla molestie elementum. Vestibulum in nibh nibh."
    };
    const value1 = object(label1, defaultValue1);

    const label2 = "Object 2";
    const defaultValue2 = {
      title: "Title example 2",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ex dolor, malesuada luctus scelerisque ac, auctor vitae risus. Vivamus risus dolor, faucibus a bibendum quis, facilisis eget odio. Nullam non condimentum orci, a cursus magna. Suspendisse tempor rutrum eros, non pellentesque odio commodo eu. Donec at volutpat enim. Vivamus mattis volutpat urna, sit amet vulputate mauris sollicitudin et. Proin consequat at dolor in sodales. Vestibulum vel porta turpis. Pellentesque sollicitudin justo est, ut dapibus felis luctus mollis. Suspendisse feugiat, metus ut auctor dictum, nulla dui fringilla nisl, a pulvinar ipsum justo non lacus. Integer vestibulum sapien metus, et congue felis efficitur iaculis. Aliquam et mi quis nulla molestie elementum. Vestibulum in nibh nibh."
    };
    const value2 = object(label2, defaultValue2);

    const label3 = "Object 3";
    const defaultValue3 = {
      title: "Title example 3",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ex dolor, malesuada luctus scelerisque ac, auctor vitae risus. Vivamus risus dolor, faucibus a bibendum quis, facilisis eget odio. Nullam non condimentum orci, a cursus magna. Suspendisse tempor rutrum eros, non pellentesque odio commodo eu. Donec at volutpat enim. Vivamus mattis volutpat urna, sit amet vulputate mauris sollicitudin et. Proin consequat at dolor in sodales. Vestibulum vel porta turpis. Pellentesque sollicitudin justo est, ut dapibus felis luctus mollis. Suspendisse feugiat, metus ut auctor dictum, nulla dui fringilla nisl, a pulvinar ipsum justo non lacus. Integer vestibulum sapien metus, et congue felis efficitur iaculis. Aliquam et mi quis nulla molestie elementum. Vestibulum in nibh nibh."
    };
    const value3 = object(label3, defaultValue3);

    const items = [value1, value2, value3];

    return {
      components: { VuePaycard },
      methods: { action: action("Card Clicked!") },
      props: {
        items: {
          type: Array,
          default: [...items.map(it => ({ ...it }))]
        },
        item: {
          type: Object,
          default: object("Item selected", {
            title: "",
            content: ""
          })
        },
        itemUniqueKey: {
          type: String,
          default: text("Item unique key", "title")
        },
        titleAttr: {
          type: String,
          default: text("Title attribute", "title")
        },
        titleCentered: {
          type: Boolean,
          default: boolean("Title centered", false)
        },
        titleClass: {
          type: String,
          default: text("Set title custom class (color red)", "")
        },
        titleSubstr: {
          type: Number,
          default: number("Title substring", 18)
        },
        contentAttr: {
          type: String,
          default: text("Content attribute", "content")
        },
        contentCentered: {
          type: Boolean,
          default: boolean("Content centered", false)
        },
        contentClass: {
          type: String,
          default: text("Set content custom class (color red)", "")
        },
        contentSubstr: {
          type: Number,
          default: number("Content substring", 250)
        },
        minWidth: {
          type: String,
          default: `${number("Timeline min-width", 200)}px`
        },
        minHeight: {
          type: String,
          default: `${number("Timeline min-height", 0)}px`
        },
        timelinePadding: {
          type: String,
          default: `${number("Timeline padding", 0)}px`
        },
        timelineBackground: {
          type: String,
          default: text("Timeline background (hex/rgb)", "#E9E9E9")
        },
        lineColor: {
          type: String,
          default: text("Line color (hex/rgb)", "#03A9F4")
        },
        clickable: {
          type: [String, Boolean],
          default: boolean("Clickable", true)
        }
      },
      template: `<vue-horizontal-timeline
        :items="items"
        :item-selected.sync="item"
        :item-unique-key="itemUniqueKey"
        :title-centered="titleCentered"
        :title-attr="titleAttr"
        :title-class="titleClass ? 'custom-class' : ''"
        :title-substr="titleSubstr"
        :content-centered="contentCentered"
        :content-attr="contentAttr"
        :content-class="contentClass ? 'custom-class' : ''"
        :content-substr="contentSubstr"
        :min-width="minWidth"
        :min-height="minHeight"
        :timeline-padding="timelinePadding"
        :timeline-background="timelineBackground"
        :line-color="lineColor"
        :clickable="clickable"
        @click="action"
      >
      <div style="font-style:17px;font-weight:bold;">
        <p>Slot text</p>
        <p>Slot text</p>
        <p>Slot text</p>
      </div>
      </vue-horizontal-timeline>`
    };
  });
