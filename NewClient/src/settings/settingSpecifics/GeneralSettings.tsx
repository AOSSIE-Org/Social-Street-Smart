import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function GeneralSettings({currSettings}:any){
    console.log(currSettings);
    return (
      <div>
        <RadioGroup defaultValue="comfortable" className="flex justify-between mb-4">
          <span>Select how to handle offensive content</span>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 mx-4">
              <RadioGroupItem value="default" id="r1" />
              <Label htmlFor="r1">Blur</Label>
            </div>
            <div className="flex items-center space-x-2 mx-4">
              <RadioGroupItem value="comfortable" id="r2" />
              <Label htmlFor="r2">Hide</Label>
            </div>
          </div>
        </RadioGroup>
  
        <div className="flex justify-between mb-4">
          <span>Reset reported contents</span>
          <Button>Reset</Button>
        </div>
      </div>
    )
  }
  