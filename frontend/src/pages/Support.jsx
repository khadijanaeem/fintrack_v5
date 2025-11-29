/*import Image from "../components/Image";
*/
export default function Support() {
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg p-8 rounded-xl">

      <h1 className="text-3xl font-bold mb-4 text-center">
        Support My Work 
      </h1>

      <p className="text-gray-600 text-center mb-10">
        If this project helps you, consider supporting me to keep development alive.
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* QR Payments */}
        <div className="border p-6 rounded-xl bg-gray-50">
          <h2 className="text-xl font-semibold mb-4 text-center">Easypaisa / JazzCash</h2>
          <img src="/qr-easypaisa.png" alt="QR" className="w-48 mx-auto mb-4" />
          
          <p className="text-center">
            <strong>Number:</strong> 03454543715 <br />
            <strong>Name:</strong> Khadija Naeem
          </p>
        </div>


      </div>

     
    </div>
  );
}
