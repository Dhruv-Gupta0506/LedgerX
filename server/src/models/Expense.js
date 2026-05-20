const mongoose=require('mongoose');
const expenseSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    amount:{
        type:Number,
        required:true
    },
    assetComparison:{
        type:String,
        trim:true
    },
    aiVibeCheck:{
        type:String,
        trim:true
    },
    category:{
        type:String,
        default:'General',
        trim:true
    }
},
{
    timestamps:true
});

const Expense=mongoose.model('Expense',expenseSchema);
module.exports=Expense;