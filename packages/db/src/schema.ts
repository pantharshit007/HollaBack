import {
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import {
  DesignType,
  LocationDataType,
  PersonalDetailsType,
  ReviewSettingsType,
  welcomeType,
} from "./db-type.js";

const createdAt = timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = timestamp("updated_at", { withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

// ENUMs
export const submissionStatusEnum = pgEnum("submission_status", [
  "pending",
  "approved",
  "rejected",
]);
export const submissionTypeEnum = pgEnum("submission_type", ["text", "video"]);

// Form Creators (Clerk-authenticated users)
export const formCreator = pgTable("form_creator", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull(),
  createdAt,
});

// Forms
export const form = pgTable("form", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => formCreator.id),
  name: text("name").notNull(),
  description: text("description"),

  design: jsonb("design").$type<DesignType>().notNull(),
  personalDetails: jsonb("personal_details").$type<PersonalDetailsType>().notNull(),
  welcome: jsonb("welcome").$type<welcomeType>().notNull(),
  reviewSettings: jsonb("review_settings")
    .$type<ReviewSettingsType>()
    .default({
      minTextLength: 5,
      maxTextLength: 200,
      maxVideoDuration: 300, // in seconds
    })
    .notNull(),

  createdAt,
  updatedAt,
});

// Reviews
export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id")
      .notNull()
      .references(() => form.id),
    email: text("email").notNull(),
    name: text("name").notNull(),
    rating: numeric("rating", { precision: 2, scale: 1 }).notNull(),
    reviewText: text("review_text").notNull(),
    submissionType: submissionTypeEnum("submission_type").notNull().default("text"),
    submissionStatus: submissionStatusEnum("submission_status").notNull().default("pending"),
    ipAddress: text("ip_address").notNull(),
    location: jsonb("location").$type<LocationDataType>().notNull(),
    createdAt,
    updatedAt,
  },
  (table) => {
    return [
      {
        reviewFormUniqueIdx: uniqueIndex("reviews_form_email_unique_id").on(
          table.email,
          table.formId
        ),
      },
    ];
  }
);

// Review media
export const reviewMedia = pgTable("review_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  reviewId: uuid("review_id")
    .notNull()
    .references(() => reviews.id),
  url: text("url").notNull(),
  duration: integer("duration"), // in seconds
  createdAt,
});

// Relations
export const formCreatorRelations = relations(formCreator, ({ many }) => ({
  forms: many(form),
}));

export const formRelations = relations(form, ({ one, many }) => ({
  creator: one(formCreator, {
    fields: [form.creatorId],
    references: [formCreator.id],
  }),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  form: one(form, {
    fields: [reviews.formId],
    references: [form.id],
  }),
  media: one(reviewMedia, {
    fields: [reviews.id],
    references: [reviewMedia.reviewId],
  }),
}));

export const reviewMediaRelations = relations(reviewMedia, ({ one }) => ({
  review: one(reviews, {
    fields: [reviewMedia.reviewId],
    references: [reviews.id],
  }),
}));
