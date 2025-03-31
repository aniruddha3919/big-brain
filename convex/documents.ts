import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

// fetching data from table 
export const getDocuments = query({
    async handler(ctx) {
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
        console.log(userId);
        if (!userId) {
            return [];
        }

        return await ctx.db.query('documents')
            .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', userId))
            .collect();
    }
})
//creating database table
export const createDocument = mutation({
    args: {
        title: v.string()
    },
    async handler(ctx, args) {
        //  verification of authenticated user
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
        console.log(userId);
        if (!userId) {
            throw new ConvexError('Not authenticated');
        }
        // inserting text in database
        await ctx.db.insert('documents', {
            title: args.title,
            tokenIdentifier: userId
        })
    },
})