use solana_program ::{
    account_info::{AccountInfo, next_account_info, next_account_infos}, 
    entrypoint::{ ProgramResult},
    entrypoint,
     msg,
     pubkey::Pubkey
    
};

use borsh :: {
    BorshDeserialize,BorshSerialize
};
#[derive(BorshDeserialize,BorshSerialize)]
struct OnchainData{
    count : u32
}
entrypoint!(process_instruction);
fn process_instruction (
    program_id : &Pubkey,
    accounts : &[AccountInfo],
    instruction_data : &[u8]
)->ProgramResult{
    let mut iter = accounts.iter();
    let data_account = next_account_info(&mut iter)?;
    
    let user_account = next_account_info(&mut iter)?;
    let  mut counter =  OnchainData::try_from_slice(&data_account.data.borrow_mut())?;

    if counter.count == 0 {
        counter.count = 1 ;
    }else{
        counter.count = counter.count * 2;
    }
    counter.serialize(&mut *data_account.data.borrow_mut());
    
    Ok(())
}