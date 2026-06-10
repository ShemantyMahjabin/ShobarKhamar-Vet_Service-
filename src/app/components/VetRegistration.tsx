import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

type AddressType = 'present' | 'permanent';

type Address = {
  house: string;
  road: string;
  district: string;
  upazila: string;
  postOffice: string;
};

type VetFormData = {
  name: string;
  institute: string;
  bvcRegistrationNo: string;
  mobile: string;
  email: string;
  presentAddress: Address;
  permanentAddress: Address;
  masterOfScience: string;
  organizationName: string;
  experienceYears: string;
  fieldOfExpertise: string;
  affiliation: string;
  anythingSpecial: string;
};

const emptyAddress: Address = {
  house: '',
  road: '',
  district: '',
  upazila: '',
  postOffice: '',
};

const districtUpazilas: Record<string, string[]> = {
  Dhaka: ['Dhamrai', 'Dohar', 'Keraniganj', 'Nawabganj', 'Savar'],
  Chattogram: ['Anwara', 'Banshkhali', 'Boalkhali', 'Chandanaish', 'Fatikchhari', 'Hathazari', 'Mirsharai', 'Patiya', 'Rangunia', 'Raozan', 'Sandwip', 'Satkania', 'Sitakunda'],
  Gazipur: ['Gazipur Sadar', 'Kaliakair', 'Kaliganj', 'Kapasia', 'Sreepur'],
  Narayanganj: ['Araihazar', 'Bandar', 'Narayanganj Sadar', 'Rupganj', 'Sonargaon'],
  Cumilla: ['Barura', 'Brahmanpara', 'Burichang', 'Chandina', 'Chauddagram', 'Cumilla Adarsha Sadar', 'Daudkandi', 'Debidwar', 'Homna', 'Laksam', 'Meghna', 'Monohorgonj', 'Muradnagar', 'Nangalkot', 'Titas'],
  Sylhet: ['Balaganj', 'Beanibazar', 'Bishwanath', 'Companiganj', 'Fenchuganj', 'Golapganj', 'Gowainghat', 'Jaintiapur', 'Kanaighat', 'Osmani Nagar', 'Sylhet Sadar', 'Zakiganj'],
  Rajshahi: ['Bagha', 'Bagmara', 'Charghat', 'Durgapur', 'Godagari', 'Mohanpur', 'Paba', 'Puthia', 'Tanore'],
  Khulna: ['Batiaghata', 'Dacope', 'Dighalia', 'Dumuria', 'Koyra', 'Paikgachha', 'Phultala', 'Rupsa', 'Terokhada'],
  Barishal: ['Agailjhara', 'Babuganj', 'Bakerganj', 'Banaripara', 'Barishal Sadar', 'Gournadi', 'Hizla', 'Mehendiganj', 'Muladi', 'Wazirpur'],
  Rangpur: ['Badarganj', 'Gangachara', 'Kaunia', 'Mithapukur', 'Pirgacha', 'Pirganj', 'Rangpur Sadar', 'Taraganj'],
  Mymensingh: ['Bhaluka', 'Dhobaura', 'Fulbaria', 'Gaffargaon', 'Gauripur', 'Haluaghat', 'Ishwarganj', 'Muktagachha', 'Mymensingh Sadar', 'Nandail', 'Phulpur', 'Trishal'],
  Bogura: ['Adamdighi', 'Bogura Sadar', 'Dhunat', 'Dhupchanchia', 'Gabtali', 'Kahaloo', 'Nandigram', 'Sariakandi', 'Shajahanpur', 'Sherpur', 'Shibganj', 'Sonatala'],
  'Coxs Bazar': ['Chakaria', 'Coxs Bazar Sadar', 'Eidgaon', 'Kutubdia', 'Maheshkhali', 'Pekua', 'Ramu', 'Teknaf', 'Ukhia'],
  Jashore: ['Abhaynagar', 'Bagherpara', 'Chaugachha', 'Jashore Sadar', 'Jhikargachha', 'Keshabpur', 'Manirampur', 'Sharsha'],
  Dinajpur: ['Birampur', 'Birganj', 'Birol', 'Bochaganj', 'Chirirbandar', 'Dinajpur Sadar', 'Fulbari', 'Ghoraghat', 'Hakimpur', 'Kaharole', 'Khansama', 'Nawabganj', 'Parbatipur'],
  Faridpur: ['Alfadanga', 'Bhanga', 'Boalmari', 'Charbhadrasan', 'Faridpur Sadar', 'Madhukhali', 'Nagarkanda', 'Sadarpur', 'Saltha'],
};

const postOfficesByDistrict: Record<string, string[]> = {
  Dhaka: ['Dhaka GPO', 'Mirpur', 'Mohammadpur', 'Savar', 'Keraniganj'],
  Chattogram: ['Chattogram GPO', 'Agrabad', 'Pahartali', 'Hathazari', 'Patiya'],
  Gazipur: ['Gazipur Sadar', 'Tongi', 'Kaliakair', 'Kapasia', 'Sreepur'],
  Narayanganj: ['Narayanganj Sadar', 'Bandar', 'Rupganj', 'Sonargaon'],
  Cumilla: ['Cumilla Sadar', 'Laksam', 'Daudkandi', 'Chandina'],
  Sylhet: ['Sylhet GPO', 'Beanibazar', 'Golapganj', 'Jaintiapur'],
  Rajshahi: ['Rajshahi GPO', 'Paba', 'Godagari', 'Bagha'],
  Khulna: ['Khulna GPO', 'Daulatpur', 'Rupsa', 'Dumuria'],
  Barishal: ['Barishal GPO', 'Gournadi', 'Bakerganj', 'Wazirpur'],
  Rangpur: ['Rangpur GPO', 'Badarganj', 'Mithapukur', 'Pirganj'],
  Mymensingh: ['Mymensingh GPO', 'Bhaluka', 'Trishal', 'Muktagachha'],
  Bogura: ['Bogura Sadar', 'Sherpur', 'Shibganj', 'Gabtali'],
  'Coxs Bazar': ['Coxs Bazar Sadar', 'Ramu', 'Teknaf', 'Ukhia'],
  Jashore: ['Jashore Sadar', 'Benapole', 'Manirampur', 'Keshabpur'],
  Dinajpur: ['Dinajpur Sadar', 'Parbatipur', 'Birampur', 'Fulbari'],
  Faridpur: ['Faridpur Sadar', 'Bhanga', 'Boalmari', 'Nagarkanda'],
};

const msOptions = ['Not applicable', 'MS in Medicine', 'MS in Surgery', 'MS in Pathology', 'MS in Microbiology', 'MS in Dairy Science', 'MS in Poultry Science', 'MS in Animal Nutrition', 'MS in Epidemiology'];
const expertiseOptions = ['Dairy cattle', 'Beef cattle', 'Goat and sheep', 'Poultry', 'Pet animal', 'Reproduction and AI', 'Surgery', 'Medicine', 'Vaccination and herd health', 'Disease surveillance'];
const affiliationOptions = ['Bangladesh Veterinary Council', 'Department of Livestock Services', 'Bangladesh Veterinary Association', 'University/Research Institute', 'Private veterinary practice', 'NGO/Livestock project', 'Pharmaceutical/Feed company'];
const instituteOptions = ['Bangladesh Agricultural University', 'Chattogram Veterinary and Animal Sciences University', 'Sher-e-Bangla Agricultural University', 'Sylhet Agricultural University', 'Hajee Mohammad Danesh Science and Technology University', 'Patuakhali Science and Technology University', 'Rajshahi University', 'Other recognized institute'];

const initialFormData: VetFormData = {
  name: '',
  institute: '',
  bvcRegistrationNo: '',
  mobile: '',
  email: '',
  presentAddress: { ...emptyAddress },
  permanentAddress: { ...emptyAddress },
  masterOfScience: '',
  organizationName: '',
  experienceYears: '',
  fieldOfExpertise: '',
  affiliation: '',
  anythingSpecial: '',
};

export function VetRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<VetFormData>(initialFormData);
  const districts = useMemo(() => Object.keys(districtUpazilas), []);

  const updateField = (field: keyof VetFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const updateAddress = (type: AddressType, field: keyof Address, value: string) => {
    const addressKey = type === 'present' ? 'presentAddress' : 'permanentAddress';

    setFormData((current) => {
      const nextAddress = { ...current[addressKey], [field]: value };

      if (field === 'district') {
        nextAddress.upazila = '';
        nextAddress.postOffice = '';
      }

      return { ...current, [addressKey]: nextAddress };
    });
  };

  const copyPresentAddress = () => {
    setFormData((current) => ({
      ...current,
      permanentAddress: { ...current.presentAddress },
    }));
  };

  const renderTextField = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    options?: { required?: boolean; placeholder?: string; type?: string },
  ) => (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-[#435160]">
        {label} {options?.required && <span className="text-[#D64545]">*</span>}
      </span>
      <input
        type={options?.type ?? 'text'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={options?.placeholder}
        required={options?.required}
        className="h-12 w-full rounded-xl border border-[#DCE7DF] bg-white px-4 text-sm font-semibold text-[#17212B] placeholder:text-[#8C99A6] focus:border-[#1E9E6F] focus:outline-none focus:ring-2 focus:ring-[#1E9E6F]/15"
      />
    </label>
  );

  const renderSelectField = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    options: string[],
    config?: { required?: boolean; placeholder?: string; disabled?: boolean },
  ) => (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-[#435160]">
        {label} {config?.required && <span className="text-[#D64545]">*</span>}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={config?.required}
        disabled={config?.disabled}
        className="h-12 w-full appearance-none rounded-xl border border-[#DCE7DF] bg-white px-4 text-sm font-semibold text-[#17212B] focus:border-[#1E9E6F] focus:outline-none focus:ring-2 focus:ring-[#1E9E6F]/15 disabled:bg-[#F2F6F4] disabled:text-[#8C99A6]"
      >
        <option value="">{config?.placeholder ?? `Select ${label.toLowerCase()}`}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );

  const renderAddressSection = (title: string, type: AddressType) => {
    const address = type === 'present' ? formData.presentAddress : formData.permanentAddress;
    const upazilas = address.district ? districtUpazilas[address.district] ?? [] : [];
    const postOffices = address.district ? postOfficesByDistrict[address.district] ?? [] : [];

    return (
      <section className="rounded-[22px] border border-[#DCE7DF] bg-white p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-extrabold text-[#17212B]">{title}</h2>
          {type === 'permanent' && (
            <button
              type="button"
              onClick={copyPresentAddress}
              className="rounded-full bg-[#E6F7EF] px-3 py-1.5 text-[11px] font-extrabold text-[#1E9E6F]"
            >
              Same as present
            </button>
          )}
        </div>

        <div className="space-y-3">
          {renderTextField('Vill/House No', address.house, (value) => updateAddress(type, 'house', value), {
            placeholder: 'House 24, West Shewrapara',
          })}
          {renderTextField('Road No', address.road, (value) => updateAddress(type, 'road', value), {
            placeholder: 'Road 7 / Union road',
          })}
          {renderSelectField('District', address.district, (value) => updateAddress(type, 'district', value), districts, {
            required: true,
            placeholder: 'Select district',
          })}
          {renderSelectField('Upazila', address.upazila, (value) => updateAddress(type, 'upazila', value), upazilas, {
            required: true,
            placeholder: address.district ? 'Select upazila' : 'Select district first',
            disabled: !address.district,
          })}
          {renderSelectField('Post Office', address.postOffice, (value) => updateAddress(type, 'postOffice', value), postOffices, {
            required: true,
            placeholder: address.district ? 'Select post office' : 'Select district first',
            disabled: !address.district,
          })}
        </div>
      </section>
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate('/vet-dashboard');
  };

  return (
    <MobileShell className="bg-[#F8FCFA]">
      <MobileStatusBar />

      <form onSubmit={handleSubmit} className="pb-24">
        <div className="sticky top-0 z-10 border-b border-[#DCE7DF] bg-[#F8FCFA]/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DCE7DF] bg-white text-[#17212B]"
              aria-label="Back to login"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#1E9E6F]">Bangladesh vet profile</p>
              <h1 className="text-xl font-black text-[#17212B]">Vet Registration</h1>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5">
          <section className="rounded-[22px] border border-[#CBE7D8] bg-[#E6F7EF] p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-[#1E9E6F]" />
              <div>
                <h2 className="text-base font-extrabold text-[#17212B]">BVC verified veterinarian account</h2>
                <p className="mt-1 text-xs font-semibold leading-5 text-[#5B6875]">
                  Add your Bangladesh Veterinary Council details and service area for livestock care requests.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[22px] border border-[#DCE7DF] bg-white p-4">
            <h2 className="mb-4 text-base font-extrabold text-[#17212B]">Basic information</h2>
            <div className="space-y-3">
              {renderTextField('Name', formData.name, (value) => updateField('name', value), {
                required: true,
                placeholder: 'Dr. Md. Rahman',
              })}
              {renderSelectField('Institute', formData.institute, (value) => updateField('institute', value), instituteOptions, {
                required: true,
                placeholder: 'Select institute',
              })}
              {renderTextField('BVC Registration No', formData.bvcRegistrationNo, (value) => updateField('bvcRegistrationNo', value), {
                required: true,
                placeholder: 'BVC-12345',
              })}
              {renderTextField('Mobile Number', formData.mobile, (value) => updateField('mobile', value), {
                required: true,
                placeholder: '+880 1XXX-XXXXXX',
                type: 'tel',
              })}
              {renderTextField('E-mail address', formData.email, (value) => updateField('email', value), {
                required: true,
                placeholder: 'doctor@example.com',
                type: 'email',
              })}
            </div>
          </section>

          {renderAddressSection('Present Address', 'present')}
          {renderAddressSection('Permanent Address', 'permanent')}

          <section className="rounded-[22px] border border-[#DCE7DF] bg-white p-4">
            <h2 className="mb-4 text-base font-extrabold text-[#17212B]">Professional details</h2>
            <div className="space-y-3">
              {renderSelectField('Master of Science', formData.masterOfScience, (value) => updateField('masterOfScience', value), msOptions, {
                placeholder: 'Select MS degree',
              })}
              {renderTextField('Present Organization Name', formData.organizationName, (value) => updateField('organizationName', value), {
                placeholder: 'DLS / Clinic / Farm / NGO',
              })}
              {renderTextField('Experience in Years', formData.experienceYears, (value) => updateField('experienceYears', value), {
                required: true,
                placeholder: '5',
                type: 'number',
              })}
              {renderSelectField('Field of Expertise', formData.fieldOfExpertise, (value) => updateField('fieldOfExpertise', value), expertiseOptions, {
                required: true,
                placeholder: 'Select expertise',
              })}
              {renderSelectField('Select Affiliation', formData.affiliation, (value) => updateField('affiliation', value), affiliationOptions, {
                required: true,
                placeholder: 'Select affiliation',
              })}
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-[#435160]">Anything special</span>
                <textarea
                  value={formData.anythingSpecial}
                  onChange={(event) => updateField('anythingSpecial', event.target.value)}
                  rows={4}
                  placeholder="Special service areas, emergency availability, chamber schedule..."
                  className="w-full resize-none rounded-xl border border-[#DCE7DF] bg-white px-4 py-3 text-sm font-semibold text-[#17212B] placeholder:text-[#8C99A6] focus:border-[#1E9E6F] focus:outline-none focus:ring-2 focus:ring-[#1E9E6F]/15"
                />
              </label>
            </div>
          </section>
        </div>

        <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-[390px] -translate-x-1/2 border-t border-[#DCE7DF] bg-white/95 px-5 py-4 backdrop-blur">
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#1E9E6F] text-sm font-extrabold text-white"
          >
            Submit application
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </MobileShell>
  );
}
