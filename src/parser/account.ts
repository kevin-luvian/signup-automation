export interface Account {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    country: string;
    city: string;
    role: string;
    skill: string;
    ex_company: string;
    ex_description: string;
    ex_start_month: string;
    ex_start_year: string;
    edu_school: string;
    edu_field_of_study: string;
    edu_degree: string;
    edu_start_year: string;
    edu_end_year: string;
    address: string;
    postal_code: string;
    date_of_birth: string;
    bio_description: string;
}

export function parseAccount(row: any): Account {
    return {
        email: row.email || '',
        password: row.password || '',
        first_name: row.first_name || '',
        last_name: row.last_name || '',
        phone_number: row.phone_number || '',
        country: row.country || '',
        city: row.city || '',
        role: row.role || '',
        skill: row.skill || '',
        ex_company: row.ex_company || '',
        ex_description: row.ex_description || '',
        ex_start_month: row.ex_start_month || '',
        ex_start_year: row.ex_start_year || '',
        edu_school: row.edu_school || '',
        edu_field_of_study: row.edu_field_of_study || '',
        edu_degree: row.edu_degree || '',
        edu_start_year: row.edu_start_year || '',
        edu_end_year: row.edu_end_year || '',
        address: row.address || '',
        postal_code: row.postal_code || '',
        date_of_birth: row.date_of_birth || '',
        bio_description: row.bio_description || '',
    };
}