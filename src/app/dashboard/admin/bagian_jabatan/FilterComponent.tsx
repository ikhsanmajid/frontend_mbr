import { Accordion } from "react-bootstrap";
import Select from 'react-select';

interface FilterComponentProps {
    selectedBagian: {value: number, label: string} | null;
    bagianOptions: {value: number, label: string}[];
    isLoadingBagian: boolean;
    onBagianChange: (option: {value: number, label: string} | null) => void;
}

export default function FilterComponent({ 
    selectedBagian, 
    bagianOptions, 
    isLoadingBagian, 
    onBagianChange 
}: FilterComponentProps) {

    return (
        <Accordion defaultActiveKey="0" className="mb-2">
            <Accordion.Item eventKey="0">
                <Accordion.Header><span className="fw-bold">Filter</span></Accordion.Header>
                <Accordion.Body>
                    <div className="row w-100">
                        <div className="row mb-3">
                            <div className="col-12 col-md-2 d-flex align-items-center mb-2 mb-md-0">
                                <span>Filter Bagian: </span>
                            </div>
                            <div className="col-12 col-md-6">
                                <Select
                                    id="selectBagian"
                                    instanceId="selectBagian"
                                    isClearable
                                    isSearchable
                                    placeholder="Pilih atau ketik nama bagian..."
                                    noOptionsMessage={() => "Tidak ada bagian ditemukan"}
                                    loadingMessage={() => "Memuat data bagian..."}
                                    isLoading={isLoadingBagian}
                                    options={bagianOptions}
                                    value={selectedBagian}
                                    onChange={(option) => onBagianChange(option)}
                                />
                            </div>
                        </div>
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}
