use solana_program ::{
    account_info::{AccountInfo, next_account_info, next_account_infos},
     entrypoint::{ProgramResult},
     entrypoint,
     msg, program::invoke_signed,
    pubkey::Pubkey,
    system_instruction::create_account,
    
};
  

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts : &[AccountInfo],
    instruction_data : &[u8]
)->ProgramResult {
    // create a new PDA 
    // pda useraccount,systemprogram 


    let iter = & mut accounts.iter();
    let pda = next_account_info( iter)?;
    let user__acc = next_account_info(iter)?;
    let program_account = next_account_info(iter)?;
    

    let seeds: &[&[u8]] = &[
    user__acc.key.as_ref(),  // public key (32 bytes)
    b"user",                 // literal string
    ];

    
    let ix = create_account
    (user__acc.key,
        pda.key,
        1000000000,
        8,
        program_id
    );
    
    let (pda,bump) = Pubkey::find_program_address(seeds, program_id);
    invoke_signed(&ix, accounts, &[seeds]);
    Ok(())
}